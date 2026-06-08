import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No subject",
    body: req.body.body || "No body",
  };
  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.json({ queued: true, job });
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);
  if (!rawJob) {
    return res.json({ processed: false, message: "No jobs in the queue" });
  }
  const job = JSON.parse(rawJob);
  // Simulate email sending
  console.log(`Sending email to ${job.to} with subject "${job.subject}"`);
  res.json({ processed: true, job });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
