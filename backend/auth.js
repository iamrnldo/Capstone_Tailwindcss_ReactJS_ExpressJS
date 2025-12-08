const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("./db");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
} = require("./emailService");
require("dotenv").config();

// Register new user
// ✅ NEW CODE - Extracts all fields
router.post("/register", async (req, res) => {
  // Extract ALL fields from request body
  const { name, email, password, phone, gender, kelas, peminatan, school } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nama, email, dan password harus diisi" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Format email tidak valid" });
  }

  // Validate enum values if provided
  const validGenders = ['laki-laki', 'perempuan'];
  const validKelas = ['10', '11', '12'];
  const validPeminatan = ['ipa', 'ips', 'bahasa'];

  if (gender && !validGenders.includes(gender)) {
    return res.status(400).json({ message: "Jenis kelamin tidak valid" });
  }

  if (kelas && !validKelas.includes(kelas)) {
    return res.status(400).json({ message: "Kelas tidak valid" });
  }

  if (peminatan && !validPeminatan.includes(peminatan)) {
    return res.status(400).json({ message: "Peminatan tidak valid" });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
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

    // Insert user with ALL fields
    const newUser = await db.query(
      `INSERT INTO users (
        name, 
        email, 
        password, 
        phone, 
        gender, 
        kelas, 
        peminatan, 
        school, 
        is_verified, 
        verification_token, 
        token_expires_at,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING id, name, email, phone, gender, kelas, peminatan, school, is_verified, created_at`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        phone || null,
        gender || null,
        kelas || null,
        peminatan || null,
        school || null,
        false,
        verificationToken,
        tokenExpiresAt
      ]
    );

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email.toLowerCase().trim(),
      verificationToken,
      name.trim()
    );

    if (!emailSent) {
      console.error("Failed to send verification email to:", email);
    }

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil! Silakan cek email Anda untuk verifikasi.",
      email: email.toLowerCase().trim(),
      userId: newUser.rows[0].id,
    });
  } catch (err) {
    console.error("Register error:", err);
    
    // Handle specific PostgreSQL errors
    if (err.code === '23505') {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }
    
    if (err.code === '22P02') {
      return res.status(400).json({ message: "Data yang dimasukkan tidak valid" });
    }
    
    res.status(500).json({ message: "Terjadi kesalahan server. Silakan coba lagi." });
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
      "UPDATE users SET is_verified = TRUE, verification_token = NULL, token_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
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
        phone: userData.phone,
        gender: userData.gender,
        kelas: userData.kelas,
        peminatan: userData.peminatan,
        school: userData.school,
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
      email.toLowerCase(),
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
      "UPDATE users SET verification_token = $1, token_expires_at = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
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
      email.toLowerCase(),
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
    const {
      password: _,
      verification_token: __,
      token_expires_at: ___,
      reset_password_token: ____,
      reset_password_expires_at: _____,
      ...userWithoutSensitiveData
    } = userData;

    res.json({
      message: "Login berhasil",
      token,
      user: userWithoutSensitiveData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email diperlukan" });

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    // Always return same message for security
    if (user.rows.length === 0) {
      return res.json({
        message: "Jika email terdaftar, link reset telah dikirim",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires_at = $2, updated_at = CURRENT_TIMESTAMP WHERE email = $3",
      [token, expiresAt, email.toLowerCase()]
    );

    await sendResetPasswordEmail(email, token, user.rows[0].name);

    res.json({ message: "Jika email terdaftar, link reset telah dikirim" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password)
    return res.status(400).json({ message: "Token & password diperlukan" });

  if (password.length < 8)
    return res.status(400).json({ message: "Password minimal 8 karakter" });

  try {
    const user = await db.query(
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires_at > NOW()",
      [token]
    );

    if (user.rows.length === 0)
      return res
        .status(400)
        .json({ message: "Token tidak valid atau sudah kadaluarsa" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, user.rows[0].id]
    );

    res.json({ message: "Password berhasil direset. Silakan login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
