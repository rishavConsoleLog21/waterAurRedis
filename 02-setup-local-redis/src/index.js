import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.json({ redis: reply });
  //   res.json({ message: `Redis replied: ${reply}` });
});

app.get("/mongo", async (req, res) => {
  const url =
    process.env.MONGODB_URL || "mongodb://localhost:27017/water-aur-redis";
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(url);
  }
  res.json({
    mongo: "connected",
    database: mongoose.connection.db.databaseName,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
