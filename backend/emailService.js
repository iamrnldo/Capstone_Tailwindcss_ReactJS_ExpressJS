const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Atau service lain: "hotmail", "yahoo", etc.
  auth: {
    user: process.env.EMAIL_USER, // Email Anda
    pass: process.env.EMAIL_PASS, // App Password (bukan password biasa)
  },
});

// Send verification email
const sendVerificationEmail = async (email, token, userName) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"EduSukses" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifikasi Email Anda - EduSukses",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            border: 1px solid #e0e0e0;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo h1 {
            color: #0c4a6e;
            margin: 0;
            font-size: 32px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0c4a6e;
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background-color: #075985;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 5px;
            padding: 10px;
            margin-top: 20px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>🎓 EduSukses</h1>
          </div>
          
          <h2>Halo, ${userName}!</h2>
          
          <p>Terima kasih telah mendaftar di <strong>EduSukses</strong>.</p>
          
          <p>Untuk menyelesaikan pendaftaran, silakan verifikasi email Anda dengan mengklik tombol di bawah ini:</p>
          
          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Verifikasi Email</a>
          </div>
          
          <p>Atau copy dan paste link berikut ke browser Anda:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 14px;">
            ${verificationLink}
          </p>
          
          <div class="warning">
            ⚠️ Link verifikasi ini akan <strong>kedaluwarsa dalam 24 jam</strong>.
          </div>
          
          <p style="margin-top: 20px;">Jika Anda tidak mendaftar di EduSukses, abaikan email ini.</p>
          
          <div class="footer">
            <p>&copy; 2024 EduSukses. All rights reserved.</p>
            <p>Email ini dikirim otomatis, mohon jangan membalas.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, userName) => {
  const mailOptions = {
    from: `"EduSukses" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Selamat Datang di EduSukses! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f0f9ff;
            border-radius: 10px;
            padding: 30px;
            border: 2px solid #0c4a6e;
          }
          .logo h1 {
            color: #0c4a6e;
            text-align: center;
            margin: 0 0 20px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0c4a6e;
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>🎓 EduSukses</h1>
          </div>
          
          <h2>Selamat Datang, ${userName}! 🎉</h2>
          
          <p>Email Anda telah berhasil diverifikasi!</p>
          
          <p>Anda sekarang dapat mulai menggunakan semua fitur EduSukses untuk membangun kebiasaan belajar yang konsisten dan hasil nyata.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Mulai Belajar</a>
          </div>
          
          <p style="margin-top: 30px;">Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
          
          <p>Salam hangat,<br><strong>Tim EduSukses</strong></p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};


const sendResetPasswordEmail = async (email, token, name) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"EduSukses" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Password Anda - EduSukses",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Halo ${name}!</h2>
        <p>Kami menerima permintaan reset password untuk akun Anda.</p>
        <p>Klik tombol di bawah ini untuk mengatur ulang password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background:#0c4a6e;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
        </div>
        <p>Link ini akan kadaluarsa dalam 1 jam.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending reset email:", error);
    return false;
  }
};



module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
};
