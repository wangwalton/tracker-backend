import { PrismaClient } from "@prisma/client";
import { config } from "dotenv-safe";
import express from "express";
import fs from "fs";
import https from "https";
var morgan = require("morgan");

const result = config();
console.log(process.env);

const USER_ID = 1;
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

app.get("/", (req, res) => {
  res.send("Successful response.");
});

app.get("/activity/list", async (req, res) => {
  const activities = await prisma.activity.findMany({
    where: { userId: USER_ID },
  });

  res.json(activities);
});

app.post("/activity/create", async (req, res) => {
  if (!req.body.input?.name) {
    res.status(400);
    res.send("Must specify name.");
    return;
  }

  await prisma.activity.create({
    data: {
      name: req.body.input.name,
      userId: USER_ID,
    },
  });
  res.sendStatus(200);
});

// Need to enforce types too.
// TODO: use JOI for input validation
app.post("/activity/delete", async (req, res) => {
  if (!req.body.input?.id) {
    res.status(400);
    res.send("Must specify id.");
    return;
  }

  await prisma.activity.delete({ where: { id: req.body.input?.id } });
  res.sendStatus(200);
});

// If there is current, stop it and then create a new one
// If there is no current, create a new one
app.post("/event/start", async (req, res) => {
  const newEvent = await prisma.event.create({
    data: {
      startTime: new Date(),
      activityId: req.body.activityId,
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: USER_ID },
  });

  if (user?.currentEventId) {
    await prisma.event.update({
      where: { id: user?.currentEventId },
      data: { endTime: new Date() },
    });
  }

  await prisma.user.update({
    where: { id: USER_ID },
    data: {
      currentEventId: newEvent.id,
    },
  });
  res.sendStatus(200);
});

app.post("/event/end", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: USER_ID },
  });

  if (user?.currentEventId) {
    await prisma.event.update({
      where: { id: user?.currentEventId },
      data: { endTime: new Date() },
    });

    await prisma.user.update({
      where: { id: USER_ID },
      data: {
        currentEvent: { disconnect: true },
      },
    });
  }
  res.sendStatus(200);
});

// Init frontend state
app.get("/me", async (req, res) => {
  const me = await prisma.user.findFirst({
    where: { id: USER_ID },
    include: { currentEvent: true, activities: true },
  });

  res.send(me);
});

if (!process.env.IS_LOCAL_DEV) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("/etc/letsencrypt/live/waltonwang.com/privkey.pem"),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/waltonwang.com/fullchain.pem"
      ),
    },
    app
  );

  httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
  });
} else {
  app.listen(4000, () => console.log("Example app is listening on port 4000."));
}
