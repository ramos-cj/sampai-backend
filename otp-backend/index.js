require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Create transporter with Gmail config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// OTP Endpoint
app.post("/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Missing email or OTP" });
  }

  const mailOptions = {
    from: `"Sampayan App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Sampayan OTP Code",
    text: `Your OTP is: ${otp}. Do not share this code with anyone.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ OTP backend server running on http://localhost:${PORT}`);
});
