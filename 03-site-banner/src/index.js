import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// In Production, we should keep const in 1 file, but here we just want to show how to use Redis, so we keep it in the same file
const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message || "welcome to our site!");
  res.json({ success: true });
});

app.get("/banner", async (req, res) => {
  const message = await redis.get(BANNER_KEY);
  if (message) {
    res.json({ success: true, message });
  }
  // else {
  //   res.status(404).json({ success: false, message: "Banner not found" });
  // }
});

app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ success: true, message: "Banner deleted successfully!" });
});

app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);
  // res.json({ success: true, exists });
  res.json({ success: true, exists: Boolean(exists) });
});

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000");
});
