const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

class ContactController {
  constructor() {
    this.transporter = null;
  }

  async initializeTransporter() {
    if (this.transporter) {
      return;
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPass) {
      console.error("Email credentials not found in environment variables");
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser.trim(),
        pass: emailPass.trim(),
      },
    });

    // this will verify the connection by sending a test email so we can see if it's working 
    try {
      await this.transporter.verify();
    //   console.log("SMTP connection verified successfully");
    } catch (error) {
      console.error("SMTP connection error:", error);
      this.transporter = null;
    }
  }

  async submitContact(req, res) {
    try {
      await this.initializeTransporter();

      if (!this.transporter) {
        return res.status(500).json({
          error: "Email service not available",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, message, to } = req.body;

      const mailOptions = {
        from: `"RetailXplore Contact" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: `New Contact Form Submission from ${name}`,
        text: `
          Name: ${name}
          Email: ${email}
          Message: ${message}
        `,
        replyTo: email,
      };

      await this.transporter.sendMail(mailOptions);

      res.json({
        message: "Contact form submitted successfully",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({
        error: "Failed to send contact form",
        details: error.message,
      });
    }
  }
}

module.exports = new ContactController();
