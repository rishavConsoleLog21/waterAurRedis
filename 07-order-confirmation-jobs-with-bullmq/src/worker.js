import { Job, Worker } from "bullmq";
import { connection } from "./queue.js";

const worker = new Worker(
  "email",
  async (job) => {
    (console.log("Processing email job...", job.id, job.name, job.data),
      await new Promise((resolve) => setTimeout(resolve, 1500)),
      console.log("Email job completed!", job.id, job.name, job.data));
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log("Job completed with result:", job.returnvalue);
});

worker.on("failed", (job, err) => {
  console.error("Job failed with error:", err);
});
