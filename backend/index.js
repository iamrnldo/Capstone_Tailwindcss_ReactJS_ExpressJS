const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Add this import for JWT verification
const db = require("./db"); // Add this import for DB queries
const cloudinary = require("cloudinary").v2; // Add for Cloudinary
const multer = require("multer"); // Add for file uploads
const fs = require("fs"); // Add for file system cleanup
require("dotenv").config();
require("./passport"); // Load Passport config

const app = express();

// Add body parsers for JSON and URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Cloudinary
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

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
    req.user = decoded; // Sets req.user to { id: ... }
    next();
  });
}

// Google Auth Route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback Route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?token=${req.user.token}`
    ); // Changed from /portal to /dashboard
  }
);

// Protected Route (get user info)
app.get("/api/user", authenticateJWT, async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM google_users WHERE id = $1", [
      req.user.id, // Changed from req.auth.id to req.user.id
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// New Route: Update Name (protected)
app.put("/api/update-name", authenticateJWT, async (req, res) => {
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
    console.error("Update name error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// New Route: Upload Profile Picture to Cloudinary (protected)
app.post(
  "/api/upload-picture",
  authenticateJWT,
  upload.single("picture"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures", // Optional: organize in a folder
        public_id: `user_${req.user.id}`, // Optional: unique ID based on user
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
      // Clean up on error
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

// Logout Route
app.get("/logout", (req, res) => {
  req.logout(() => res.redirect(process.env.FRONTEND_URL));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
