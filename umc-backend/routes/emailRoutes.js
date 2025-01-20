const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const createEmailTemplate = (data) => {
  const { name, mobile, subject, email, feedback } = data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="text-align: center; color: #29aae1;">New Feedback Received</h2>
      <p style="font-size: 16px; text-align: center; color: #555;">You have received new feedback through KBMC. Below are the details:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tbody>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Mobile:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${mobile}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Subject:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${subject}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Feedback:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${feedback}</td>
          </tr>
        </tbody>
      </table>
    </div>
    `;
};

router.post("/email", async (req, res) => {
  const { name, mobile, subject, email, feedback } = req.body;

  if (!name || !mobile || !subject || !email || !feedback) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const mailOptions = {
      from: `${name} <${process.env.USER}>`,
      replyTo: `${email}`,
      to: "admin@kbmc.gov.in",
      subject: "New Feedback Received from KBMC",
      html: createEmailTemplate(req.body),
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Feedback sent and email delivered successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email" });
  }
});

module.exports = router;
