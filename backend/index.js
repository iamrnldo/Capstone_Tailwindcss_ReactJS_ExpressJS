const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Add this import for JWT verification
const db = require("./db"); // Add this import for DB queries
require("dotenv").config();
require("./passport"); // Load Passport config

const app = express();

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
    const user = await db.query("SELECT * FROM users WHERE id = $1", [
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

// Logout Route
app.get("/logout", (req, res) => {
  req.logout(() => res.redirect(process.env.FRONTEND_URL));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
