const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("./db");
const { sendVerificationEmail, sendWelcomeEmail } = require("./emailService");
require("dotenv").config();

// Register new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter" });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Insert user (unverified)
    const newUser = await db.query(
      "INSERT INTO users (name, email, password, is_verified, verification_token, token_expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, is_verified, created_at",
      [name, email, hashedPassword, false, verificationToken, tokenExpiresAt]
    );

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      verificationToken,
      name
    );

    if (!emailSent) {
      console.error("Failed to send verification email");
      // Continue even if email fails - user can request resend later
    }

    res.status(201).json({
      message: "Registrasi berhasil! Silakan cek email Anda untuk verifikasi.",
      email: email,
      userId: newUser.rows[0].id,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify email with token
router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  try {
    // Find user with token
    const user = await db.query(
      "SELECT * FROM users WHERE verification_token = $1",
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Token tidak valid" });
    }

    const userData = user.rows[0];

    // Check if already verified
    if (userData.is_verified) {
      return res.status(400).json({ message: "Email sudah diverifikasi" });
    }

    // Check if token expired
    if (new Date() > new Date(userData.token_expires_at)) {
      return res.status(400).json({ message: "Token sudah kedaluwarsa" });
    }

    // Update user as verified
    await db.query(
      "UPDATE users SET is_verified = TRUE, verification_token = NULL, token_expires_at = NULL WHERE id = $1",
      [userData.id]
    );

    // Send welcome email
    await sendWelcomeEmail(userData.email, userData.name);

    // Generate JWT token for auto-login
    const jwtToken = jwt.sign(
      { id: userData.id, type: "regular" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Email berhasil diverifikasi!",
      token: jwtToken,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        is_verified: true,
      },
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email harus diisi" });
  }

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const userData = user.rows[0];

    if (userData.is_verified) {
      return res.status(400).json({ message: "Email sudah diverifikasi" });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update token
    await db.query(
      "UPDATE users SET verification_token = $1, token_expires_at = $2 WHERE id = $3",
      [verificationToken, tokenExpiresAt, userData.id]
    );

    // Resend email
    const emailSent = await sendVerificationEmail(
      email,
      verificationToken,
      userData.name
    );

    if (!emailSent) {
      return res.status(500).json({ message: "Gagal mengirim email" });
    }

    res.json({ message: "Email verifikasi telah dikirim ulang" });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  try {
    // Check if user exists
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const userData = user.rows[0];

    // Check if email is verified
    if (!userData.is_verified) {
      return res.status(403).json({
        message:
          "Email belum diverifikasi. Silakan cek email Anda untuk verifikasi.",
        needsVerification: true,
        email: email,
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userData.id, type: "regular" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData;

    res.json({
      message: "Login berhasil",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
