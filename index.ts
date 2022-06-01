import { PrismaClient } from "@prisma/client";
import { config } from "dotenv-safe";
import express from "express";
import fs from "fs";
import https from "https";

const result = config();
console.log(process.env);

const USER_ID = 1;
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

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
  app.listen(3000, () => console.log("Example app is listening on port 3000."));
}
