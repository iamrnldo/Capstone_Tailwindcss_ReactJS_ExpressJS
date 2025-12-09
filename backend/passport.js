const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, // Enable access to req object
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const { id: google_id, displayName: name, emails, photos } = profile;
      const email = emails[0].value;
      const picture = photos[0]?.value || null;

      try {
        // Check if user exists
        const existingUser = await db.query(
          "SELECT * FROM google_users WHERE google_id = $1",
          [google_id]
        );

        const intent = req.session?.googleAuthIntent || "login";
        const userExists = existingUser.rows.length > 0;

        if (intent === "login") {
          if (!userExists) {
            // User tried to login but doesn't have an account
            return done(null, {
              error: "not_registered",
              googleProfile: { google_id, name, email, picture },
            });
          }

          // User exists - proceed with login
          const token = jwt.sign(
            { id: existingUser.rows[0].id, type: "google" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          return done(null, { ...existingUser.rows[0], token, success: true });
        } else if (intent === "register") {
          if (userExists) {
            // User tried to register but already has an account
            const token = jwt.sign(
              { id: existingUser.rows[0].id, type: "google" },
              process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );
            return done(null, {
              error: "already_registered",
              user: existingUser.rows[0],
              token,
            });
          }

          // Create new user
          const newUser = await db.query(
            "INSERT INTO google_users (google_id, name, email, picture) VALUES ($1, $2, $3, $4) RETURNING *",
            [google_id, name, email, picture]
          );

          const token = jwt.sign(
            { id: newUser.rows[0].id, type: "google" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          return done(null, { ...newUser.rows[0], token, success: true });
        }

        // Default fallback - treat as login
        if (userExists) {
          const token = jwt.sign(
            { id: existingUser.rows[0].id, type: "google" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          return done(null, { ...existingUser.rows[0], token, success: true });
        } else {
          return done(null, {
            error: "not_registered",
            googleProfile: { google_id, name, email, picture },
          });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
