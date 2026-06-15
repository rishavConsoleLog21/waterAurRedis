import express from "express";
import { emailQueue } from "./queue.js";

const app = express();

app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add(
    "welcome-email",
    {
      to: req.body.to,
      name: req.body.name || "Customer",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );
  res.json({ message: "Welcome email job added to the queue!", jobId: job.id });
});

app.post("/order-confirmation-email", async (req, res) => {
  const job = await emailQueue.add(
    "order-confirmation-email",
    {
      to: req.body.to,
      orderId: req.body.orderId,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );
  res.json({
    message: "Order confirmation email job added to the queue!",
    jobId: job.id,
  });
});

app.post("/password-reset-email", async (req, res) => {
  const job = await emailQueue.add(
    "password-reset-email",
    {
      to: req.body.to,
      resetToken: req.body.resetToken,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );
  res.json({
    message: "Password reset email job added to the queue!",
    jobId: job.id,
  });
});

app.post("/newsletter-email", async (req, res) => {
  const job = await emailQueue.add(
    "newsletter-email",
    {
      to: req.body.to,
      newsletterId: req.body.newsletterId,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );
  res.json({
    message: "Newsletter email job added to the queue!",
    jobId: job.id,
  });
});

app.get("/job-status/:id", async (req, res) => {
  const job = await emailQueue.getJob(req.params.id);
  if (job) {
    const state = await job.getState();
    res.json({ jobId: job.id, state, data: job.data });
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
