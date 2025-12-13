const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");
const db = require("./db");
require("dotenv").config();

// ============================================
// ENUM Constants (must match database enums)
// ============================================
const VALID_GENDERS = ["laki-laki", "perempuan"];
const VALID_KELAS = ["10", "11", "12"];
const VALID_PEMINATAN = ["ipa", "ips", "bahasa"];

// ============================================
// Validation Helpers
// ============================================
const validateEnum = (value, validValues, fieldName) => {
  if (value && !validValues.includes(value)) {
    return `${fieldName} tidak valid. Pilihan: ${validValues.join(", ")}`;
  }
  return null;
};

const validatePhone = (phone) => {
  if (!phone) return null;
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ""))) {
    return "Format nomor telepon tidak valid";
  }
  return null;
};

// ============================================
// Multer Setup for File Upload
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "/tmp";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `profile-${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only image files (JPEG, PNG, GIF, WEBP) are allowed"),
        false
      );
    }
  },
});

// ============================================
// JWT Authentication Middleware
// ============================================
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak valid" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token sudah kadaluarsa" });
      }
      return res.status(403).json({ message: "Token tidak valid" });
    }
    req.user = decoded;
    next();
  });
}

// ============================================
// Helper function to clean up uploaded file
// ============================================
const cleanupFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
};

// ============================================
// GET /api/profile - Get User Profile
// ============================================
router.get("/", authenticateJWT, async (req, res) => {
  try {
    let user;

    if (req.user.type === "google") {
      user = await db.query(
        `SELECT 
          id, 
          google_id,
          name, 
          email, 
          picture, 
          phone, 
          gender, 
          kelas, 
          peminatan, 
          school, 
          is_verified,
          created_at,
          updated_at
        FROM google_users 
        WHERE id = $1`,
        [req.user.id]
      );
    } else {
      user = await db.query(
        `SELECT 
          id, 
          name, 
          email, 
          picture, 
          phone, 
          gender, 
          kelas, 
          peminatan, 
          school,
          is_verified, 
          created_at,
          updated_at
        FROM users 
        WHERE id = $1`,
        [req.user.id]
      );
    }

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Add user type to response
    const userData = {
      ...user.rows[0],
      type: req.user.type || "regular",
    };

    res.json(userData);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ============================================
// PUT /api/profile - Update User Profile
// ============================================
router.put("/", authenticateJWT, async (req, res) => {
  const { name, phone, gender, kelas, peminatan, school } = req.body;

  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Nama harus diisi" });
  }

  // Validate name length
  if (name.trim().length < 2) {
    return res.status(400).json({ message: "Nama minimal 2 karakter" });
  }

  if (name.trim().length > 100) {
    return res.status(400).json({ message: "Nama maksimal 100 karakter" });
  }

  // Validate enums
  const genderError = validateEnum(gender, VALID_GENDERS, "Jenis kelamin");
  if (genderError) {
    return res.status(400).json({ message: genderError });
  }

  const kelasError = validateEnum(kelas, VALID_KELAS, "Kelas");
  if (kelasError) {
    return res.status(400).json({ message: kelasError });
  }

  const peminatanError = validateEnum(peminatan, VALID_PEMINATAN, "Peminatan");
  if (peminatanError) {
    return res.status(400).json({ message: peminatanError });
  }

  // Validate phone (optional)
  const phoneError = validatePhone(phone);
  if (phoneError) {
    return res.status(400).json({ message: phoneError });
  }

  // Validate school length (optional)
  if (school && school.length > 255) {
    return res
      .status(400)
      .json({ message: "Nama sekolah maksimal 255 karakter" });
  }

  try {
    let updatedUser;
    const table = req.user.type === "google" ? "google_users" : "users";

    updatedUser = await db.query(
      `UPDATE ${table} 
       SET 
         name = $1, 
         phone = $2, 
         gender = $3, 
         kelas = $4, 
         peminatan = $5, 
         school = $6, 
         updated_at = CURRENT_TIMESTAMP 
       WHERE id = $7 
       RETURNING 
         id, 
         name, 
         email, 
         picture, 
         phone, 
         gender, 
         kelas, 
         peminatan, 
         school, 
         is_verified,
         created_at,
         updated_at`,
      [
        name.trim(),
        phone ? phone.trim() : null,
        gender || null,
        kelas || null,
        peminatan || null,
        school ? school.trim() : null,
        req.user.id,
      ]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Add user type to response
    const userData = {
      ...updatedUser.rows[0],
      type: req.user.type || "regular",
    };

    res.json(userData);
  } catch (err) {
    console.error("Update profile error:", err);

    // Handle specific PostgreSQL errors
    if (err.code === "22P02") {
      return res.status(400).json({
        message: "Data tidak valid. Pastikan semua field terisi dengan benar.",
      });
    }

    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ============================================
// POST /api/profile/upload-picture - Upload Profile Picture
// ============================================
router.post(
  "/upload-picture",
  authenticateJWT,
  upload.single("picture"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    try {
      // Get current user picture to delete from Cloudinary later
      const table = req.user.type === "google" ? "google_users" : "users";
      const currentUser = await db.query(
        `SELECT picture FROM ${table} WHERE id = $1`,
        [req.user.id]
      );

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
        public_id: `user_${req.user.id}_${Date.now()}`,
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      });

      // Update user picture in database
      await db.query(
        `UPDATE ${table} 
         SET picture = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [result.secure_url, req.user.id]
      );

      // Delete old picture from Cloudinary if exists
      if (currentUser.rows[0]?.picture) {
        const oldPictureUrl = currentUser.rows[0].picture;
        // Extract public_id from Cloudinary URL
        const matches = oldPictureUrl.match(/profile_pictures\/([^.]+)/);
        if (matches && matches[1]) {
          try {
            await cloudinary.uploader.destroy(`profile_pictures/${matches[1]}`);
          } catch (deleteErr) {
            console.error(
              "Error deleting old picture from Cloudinary:",
              deleteErr
            );
          }
        }
      }

      // Delete local file
      cleanupFile(req.file.path);

      res.json({
        message: "Foto profil berhasil diperbarui",
        picture: result.secure_url,
      });
    } catch (err) {
      // Clean up local file on error
      cleanupFile(req.file?.path);

      console.error("Upload picture error:", err);

      if (err.message?.includes("File size too large")) {
        return res
          .status(400)
          .json({ message: "Ukuran file terlalu besar. Maksimal 5MB" });
      }

      res.status(500).json({
        message: "Gagal mengupload foto",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

// ============================================
// DELETE /api/profile/picture - Delete Profile Picture
// ============================================
router.delete("/picture", authenticateJWT, async (req, res) => {
  try {
    const table = req.user.type === "google" ? "google_users" : "users";

    // Get current picture URL
    const currentUser = await db.query(
      `SELECT picture FROM ${table} WHERE id = $1`,
      [req.user.id]
    );

    if (!currentUser.rows[0]?.picture) {
      return res
        .status(400)
        .json({ message: "Tidak ada foto profil untuk dihapus" });
    }

    const pictureUrl = currentUser.rows[0].picture;

    // Delete from Cloudinary
    const matches = pictureUrl.match(/profile_pictures\/([^.]+)/);
    if (matches && matches[1]) {
      try {
        await cloudinary.uploader.destroy(`profile_pictures/${matches[1]}`);
      } catch (deleteErr) {
        console.error("Error deleting from Cloudinary:", deleteErr);
      }
    }

    // Update database
    await db.query(
      `UPDATE ${table} 
       SET picture = NULL, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [req.user.id]
    );

    res.json({ message: "Foto profil berhasil dihapus" });
  } catch (err) {
    console.error("Delete picture error:", err);
    res.status(500).json({ message: "Gagal menghapus foto profil" });
  }
});

// ============================================
// PUT /api/profile/change-password - Change Password
// ============================================
router.put("/change-password", authenticateJWT, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Google users cannot change password
  if (req.user.type === "google") {
    return res.status(400).json({
      message:
        "Akun Google tidak memiliki password. Gunakan pengaturan akun Google untuk mengubah password.",
    });
  }

  // Validate input
  if (!oldPassword) {
    return res.status(400).json({ message: "Password lama harus diisi" });
  }

  if (!newPassword) {
    return res.status(400).json({ message: "Password baru harus diisi" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password baru minimal 8 karakter" });
  }

  if (newPassword.length > 128) {
    return res
      .status(400)
      .json({ message: "Password baru maksimal 128 karakter" });
  }

  // Check password strength (optional)
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumbers = /\d/.test(newPassword);

  if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
    return res.status(400).json({
      message: "Password harus mengandung huruf besar, huruf kecil, dan angka",
    });
  }

  // Check if old and new password are the same
  if (oldPassword === newPassword) {
    return res.status(400).json({
      message: "Password baru tidak boleh sama dengan password lama",
    });
  }

  try {
    // Get user from database
    const userResult = await db.query(
      "SELECT id, password FROM users WHERE id = $1",
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = userResult.rows[0];

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Password lama salah" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, req.user.id]
    );

    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ============================================
// GET /api/profile/enums - Get Available Enum Values
// ============================================
router.get("/enums", (req, res) => {
  res.json({
    genders: VALID_GENDERS.map((value) => ({
      value,
      label: value === "laki-laki" ? "Laki-laki" : "Perempuan",
    })),
    kelas: VALID_KELAS.map((value) => ({
      value,
      label: `Kelas ${value}`,
    })),
    peminatan: VALID_PEMINATAN.map((value) => ({
      value,
      label: value.toUpperCase(),
    })),
  });
});

// ============================================
// DELETE /api/profile - Delete Account
// ============================================
router.delete("/", authenticateJWT, async (req, res) => {
  const { password } = req.body;

  try {
    const table = req.user.type === "google" ? "google_users" : "users";

    // For regular users, verify password
    if (req.user.type !== "google") {
      if (!password) {
        return res
          .status(400)
          .json({ message: "Password diperlukan untuk menghapus akun" });
      }

      const userResult = await db.query(
        "SELECT password FROM users WHERE id = $1",
        [req.user.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        userResult.rows[0].password
      );

      if (!isValidPassword) {
        return res.status(400).json({ message: "Password salah" });
      }
    }

    // Get user picture to delete from Cloudinary
    const currentUser = await db.query(
      `SELECT picture FROM ${table} WHERE id = $1`,
      [req.user.id]
    );

    // Delete picture from Cloudinary if exists
    if (currentUser.rows[0]?.picture) {
      const pictureUrl = currentUser.rows[0].picture;
      const matches = pictureUrl.match(/profile_pictures\/([^.]+)/);
      if (matches && matches[1]) {
        try {
          await cloudinary.uploader.destroy(`profile_pictures/${matches[1]}`);
        } catch (deleteErr) {
          console.error("Error deleting from Cloudinary:", deleteErr);
        }
      }
    }

    // Delete user from database
    await db.query(`DELETE FROM ${table} WHERE id = $1`, [req.user.id]);

    res.json({ message: "Akun berhasil dihapus" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Gagal menghapus akun" });
  }
});

// ============================================
// Error Handler for Multer
// ============================================
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Ukuran file terlalu besar. Maksimal 5MB" });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.message === "Only image files (JPEG, PNG, GIF, WEBP) are allowed") {
    return res
      .status(400)
      .json({
        message: "Hanya file gambar yang diperbolehkan (JPEG, PNG, GIF, WEBP)",
      });
  }

  next(err);
});

module.exports = router;
