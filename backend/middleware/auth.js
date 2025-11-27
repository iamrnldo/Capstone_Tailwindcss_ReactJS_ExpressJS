const { expressjwt: expressJwt } = require("express-jwt");
require("dotenv").config();

const authenticateJWT = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

module.exports = authenticateJWT;
