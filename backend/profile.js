const express = require("express");
const router = express.Router();
const db = require("./db");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// JWT authentication middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded;
    next();
  });
}

// Helper function to determine which table to use
async function findUserTable(userId) {
  // Try users table first
  const regularUser = await db.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  if (regularUser.rows.length > 0) {
    return { table: "users", user: regularUser.rows[0] };
  }

  // Try google_users table
  const googleUser = await db.query(
    "SELECT * FROM google_users WHERE id = $1",
    [userId]
  );
  if (googleUser.rows.length > 0) {
    return { table: "google_users", user: googleUser.rows[0] };
  }

  return null;
}

// GET /api/profile - Get user profile
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const result = await findUserTable(req.user.id);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password if exists
    const { password, ...userWithoutPassword } = result.user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile - Update user name
router.put("/", authenticateJWT, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const result = await findUserTable(req.user.id);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await db.query(
      `UPDATE ${result.table} SET name = $1 WHERE id = $2 RETURNING *`,
      [name, req.user.id]
    );

    // Remove password if exists
    const { password, ...userWithoutPassword } = updatedUser.rows[0];
    res.json(userWithoutPassword);
  } catch (err) {
    console.error("Update name error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/profile/picture - Upload profile picture to Cloudinary
router.post(
  "/upload-picture",
  authenticateJWT,
  upload.single("picture"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const result = await findUserTable(req.user.id);

      if (!result) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "User not found" });
      }

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
        public_id: `user_${req.user.id}`,
      });

      // Update user's picture URL in DB
      await db.query(`UPDATE ${result.table} SET picture = $1 WHERE id = $2`, [
        uploadResult.secure_url,
        req.user.id,
      ]);

      // Clean up temporary file
      fs.unlinkSync(req.file.path);

      res.json({ picture: uploadResult.secure_url });
    } catch (err) {
      console.error("Upload picture error:", err);
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

module.exports = router;
