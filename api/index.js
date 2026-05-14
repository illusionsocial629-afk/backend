const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// file upload setup
const upload = multer({ dest: "uploads/" });

// Gmail SMTP setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amorphousindia1@gmail.com",      // 👈 yaha apna gmail
    pass: "psgs hdis ljyh hisa",         // 👈 Gmail app password
  },
});

// API route
app.post("/send", upload.single("file"), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const file = req.file;

    const mailOptions = {
      from: `Contact Form <amorphousindia1@gmail.com>`,
      to: "amorphousindia1@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h2>New Inquiry Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
      attachments: file
        ? [
            {
              filename: file.originalname,
              path: file.path,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});