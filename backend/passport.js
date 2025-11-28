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
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id: google_id, displayName: name, emails, photos } = profile;
      const email = emails[0].value;
      const picture = photos[0].value;

      try {
        let user = await db.query(
          "SELECT * FROM google_users WHERE google_id = $1",
          [google_id]
        );
        if (user.rows.length === 0) {
          user = await db.query(
            "INSERT INTO google_users (google_id, name, email, picture) VALUES ($1, $2, $3, $4) RETURNING *",
            [google_id, name, email, picture]
          );
        }
        const token = jwt.sign(
          { id: user.rows[0].id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return done(null, { ...user.rows[0], token });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await db.query("SELECT * FROM google_users WHERE id = $1", [id]);
  done(null, user.rows[0]);
});
