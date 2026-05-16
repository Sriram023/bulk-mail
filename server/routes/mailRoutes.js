const express = require("express");
const nodemailer = require("nodemailer");
const Mail = require("../models/Mail");

const router = express.Router();

/* ================= EMAIL TRANSPORTER ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

/* ================= SEND EMAIL ROUTE ================= */

router.post("/send", async (req, res) => {
  try {
    const { subject, text, emails } = req.body;

    // ===== VALIDATION =====

    if (!subject || !text || emails.length === 0) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ===== SEND EMAILS =====

    for (let i = 0; i < emails.length; i++) {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: emails[i],
        subject: subject,
        text: text,
      });
    }

    // ===== SAVE TO DATABASE =====

    const newMail = new Mail({
      subject,
      text,
      emails,
      status: "Success",
    });

    await newMail.save();

    // ===== SUCCESS RESPONSE =====

    res.status(200).json({
      message: "Emails Sent Successfully 🚀",
    });

  } catch (error) {

    console.log(error);

    // ===== SAVE FAILED STATUS =====

    const failedMail = new Mail({
      subject: req.body.subject,
      text: req.body.text,
      emails: req.body.emails,
      status: "Failed",
    });

    await failedMail.save();

    // ===== ERROR RESPONSE =====

    res.status(500).json({
      message: "Failed to Send Emails ❌",
    });
  }
});

/* ================= EMAIL HISTORY ROUTE ================= */

router.get("/history", async (req, res) => {
  try {

    const history = await Mail.find().sort({
      createdAt: -1,
    });

    res.status(200).json(history);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to Fetch Email History",
    });
  }
});

module.exports = router;