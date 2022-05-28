import { PrismaClient } from "@prisma/client";
import express from "express";

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

app.listen(3000, () => console.log("Example app is listening on port 3000."));
