import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

const redis = new Redis();

function otpKey(phoneNumber) {
  return `otp:${phoneNumber}`;
}

app.post("/otp", async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP,
  //await redis.setex(`otp:${phoneNumber}`, 300, otp); // Store OTP with a TTL of 5 minutes (300 seconds)
  await redis.set(otpKey(phoneNumber), otp, "EX", 300); // Store OTP with a TTL of 5 minutes (300 seconds)

  // In a real application, you would send the OTP to the user's phone number here
  console.log(`OTP for Phone Number +91 ${phoneNumber}: ${otp}`);

  res.json({ success: true });
});

app.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const savedOtp = await redis.get(otpKey(phoneNumber)); // Retrieve the OTP from Redis

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  if (!savedOtp) {
    return res.status(400).json({ error: "Invalid phone number or OTP" });
  }

  if (savedOtp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // In a real application, you would typically remove the OTP from Redis after successful verification
  await redis.del(otpKey(phoneNumber));
  res.json({ success: true, message: "OTP verified successfully" });
});

//TODO: 12:55
app.get("/otp/:phoneNumber/ttl", async (req, res) => {
  const { phoneNumber } = req.params;
  const otp = await redis.get(otpKey(phoneNumber));
  if (!otp) {
    return res.status(404).json({ error: "OTP not found" });
  }
  const ttl = await redis.ttl(otpKey(phoneNumber));
  res.json({ otp, ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
