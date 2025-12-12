const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
require("./passport");

const app = express();

// Import routers
const profileRouter = require("./profile");
const authRouter = require("./auth");
const dashboardRouter = require("./dashboard"); // Add this
const detailMapelRouter = require("./detail_mapel"); 
const materiRouter = require("./materi");
const latihanRouter = require("./latihan");
const tryoutRouter = require("./tryout");

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
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
    req.user = decoded;
    next();
  });
}

// ============================================
// GOOGLE AUTH ROUTES - LOGIN
// ============================================
app.get("/auth/google/login", (req, res, next) => {
  req.session.googleAuthIntent = "login";
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});

// ============================================
// GOOGLE AUTH ROUTES - REGISTER
// ============================================
app.get("/auth/google/register", (req, res, next) => {
  req.session.googleAuthIntent = "register";
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});

// ============================================
// GOOGLE AUTH CALLBACK - Handles both login and register
// ============================================
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    const intent = req.session?.googleAuthIntent || "login";

    // Clear the intent from session
    if (req.session) {
      delete req.session.googleAuthIntent;
    }

    // Handle error cases
    if (req.user.error === "not_registered") {
      const encodedEmail = encodeURIComponent(req.user.googleProfile.email);
      const encodedName = encodeURIComponent(req.user.googleProfile.name);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?google_error=not_registered&email=${encodedEmail}&name=${encodedName}`
      );
    }

    if (req.user.error === "already_registered") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/register?google_error=already_registered&token=${req.user.token}`
      );
    }

    // Success - redirect to dashboard with token
    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?token=${req.user.token}`
    );
  }
);

// Legacy route - defaults to login behavior
app.get("/auth/google", (req, res, next) => {
  req.session.googleAuthIntent = "login";
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});




// Protected Route (get user info from both tables)
// Protected Route (get user info from both tables)
app.get("/api/user", authenticateJWT, async (req, res) => {
  console.log("GET /api/user called");
  console.log("User from JWT:", req.user);

  try {
    let user;

    if (req.user.type === "google") {
      console.log("Looking in google_users table...");
      // SELECT * automatically includes is_premium if the column exists
      user = await db.query("SELECT * FROM google_users WHERE id = $1", [
        req.user.id,
      ]);
    } else {
      console.log("Looking in users table...");
      // UPDATE THIS LINE: Added ", is_premium" to the select list
      user = await db.query(
        "SELECT id, name, email, picture, phone, gender, kelas, peminatan, school, created_at, is_premium FROM users WHERE id = $1",
        [req.user.id]
      );
    }

    // Fallback: try both tables if not found
    if (user.rows.length === 0) {
      console.log("User not found in primary table, trying other...");
      user = await db.query(
        "SELECT id, name, email, picture, phone, gender, kelas, peminatan, school, created_at, is_premium FROM users WHERE id = $1",
        [req.user.id]
      );

      if (user.rows.length === 0) {
        user = await db.query("SELECT * FROM google_users WHERE id = $1", [
          req.user.id,
        ]);
      }
    }

    if (user.rows.length === 0) {
      console.log("User not found in any table");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.rows[0]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================
// Mount routers
// ============================================
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter); // Add this
app.use("/api/detail-mapel", detailMapelRouter); // Add this line
app.use("/api/materi", materiRouter);
app.use("/api/latihan", latihanRouter);
app.use("/api/tryout", tryoutRouter);

// Legacy endpoints
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

// Add to your imports
const kelasRouter = require("./kelas");

// Add to your route mounts (after other routers)
app.use("/api/kelas", kelasRouter);

app.post(
  "/api/upload-picture",
  authenticateJWT,
  upload.single("picture"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
        public_id: `user_${req.user.id}`,
      });

      await db.query("UPDATE google_users SET picture = $1 WHERE id = $2", [
        result.secure_url,
        req.user.id,
      ]);

      fs.unlinkSync(req.file.path);

      res.json({ picture: result.secure_url });
    } catch (err) {
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
