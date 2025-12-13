const { Pool } = require("pg");
require("dotenv").config();

// Cek apakah kita sedang di mode Production (Vercel) atau Development (Local)
const isProduction = process.env.NODE_ENV === "production";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  // Konfigurasi SSL: Wajib true/object di Production, false di Local
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
