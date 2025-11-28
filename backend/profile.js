const express = require("express");
const router = express.Router();
const db = require("./db");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Configure Cloudinary (redundant if in index.js, but for modularity)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Temporary folder (create it if it doesn't exist)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// JWT authentication middleware (copied for modularity; can be imported if shared)
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
    req.user = decoded; // Sets req.user to { id: ... }
    next();
  });
}

// GET /api/profile - Get user profile
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM google_users WHERE id = $1", [
      req.user.id,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error("Get profile error:", err); // Added logging
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
    const updatedUser = await db.query(
      "UPDATE google_users SET name = $1 WHERE id = $2 RETURNING *",
      [name, req.user.id]
    );
    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error("Update name error:", err); // Added logging
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/profile/picture - Upload profile picture to Cloudinary
router.post(
  "/picture",
  authenticateJWT,
  upload.single("picture"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Upload to Cloudinary with updated folder path
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles", // Changed folder path from 'profile_pictures' to 'user_profiles'
        public_id: `user_${req.user.id}`, // Unique ID based on user
      });

      // Update user's picture URL in DB
      await db.query("UPDATE google_users SET picture = $1 WHERE id = $2", [
        result.secure_url,
        req.user.id,
      ]);

      // Clean up temporary file
      fs.unlinkSync(req.file.path);

      res.json({ picture: result.secure_url });
    } catch (err) {
      console.error("Upload picture error:", err); // Added logging
      // Clean up on error
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

module.exports = router;
