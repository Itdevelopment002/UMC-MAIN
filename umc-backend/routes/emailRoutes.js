const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER1,
    pass: process.env.PASS,
  },
});

const createEmailTemplate = (data) => {
  const { rating, opinion, comment } = data;

  // Generate star icons based on the rating
  const stars = "⭐".repeat(rating); // Repeat the star emoji based on the rating value

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="text-align: center; color: #29aae1;">New Feedback Received</h2>
      <p style="font-size: 16px; text-align: center; color: #555;">You have received new feedback through UMC. Below are the details:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tbody>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Rating:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${stars}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Liked the website:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${opinion}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Additional Comments:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${comment}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};

router.post("/email", async (req, res) => {
  const { rating, opinion, comment } = req.body;

  if (!rating || !opinion || !comment) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const mailOptions = {
      from: `no reply <${process.env.USER1}>`,
      to: "cfcumc@gmail.com",
      subject: "New Feedback Received from UMC",
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
