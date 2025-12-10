// backend/kelas.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

// ============================================
// Optional Authentication Middleware
// ============================================
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    req.user = err ? null : decoded;
    next();
  });
}

// ============================================
// GET /api/kelas/mapel - Get All Mata Pelajaran
// ============================================
router.get("/mapel", optionalAuth, async (req, res) => {
  try {
    const { category, search, limit, offset, sortBy, sortOrder } = req.query;

    let query = `
      SELECT 
        id,
        nama,
        slug,
        deskripsi,
        icon,
        category,
        color,
        is_active,
        created_at,
        updated_at
      FROM jenis_mapel
      WHERE is_active = true
    `;

    const params = [];
    let paramCount = 0;

    // Filter by category
    if (category && category !== "all") {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    // Search by name or description
    if (search) {
      paramCount++;
      query += ` AND (LOWER(nama) LIKE LOWER($${paramCount}) OR LOWER(deskripsi) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
    }

    // Sorting
    const allowedSortFields = ["nama", "created_at", "category"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "nama";
    const order = sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    query += ` ORDER BY ${sortField} ${order}`;

    // Pagination
    if (limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
    }

    if (offset) {
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      params.push(parseInt(offset));
    }

    const result = await db.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM jenis_mapel WHERE is_active = true`;
    const countParams = [];
    let countParamNum = 0;

    if (category && category !== "all") {
      countParamNum++;
      countQuery += ` AND category = $${countParamNum}`;
      countParams.push(category);
    }

    if (search) {
      countParamNum++;
      countQuery += ` AND (LOWER(nama) LIKE LOWER($${countParamNum}) OR LOWER(deskripsi) LIKE LOWER($${countParamNum}))`;
      countParams.push(`%${search}%`);
    }

    const countResult = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      message: "Data mata pelajaran berhasil diambil",
    });
  } catch (err) {
    console.error("Get mapel error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data mata pelajaran",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// ============================================
// GET /api/kelas/mapel/:slug - Get Single Mata Pelajaran with Details
// ============================================
router.get("/mapel/:slug", optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    // Get mapel data
    const mapelResult = await db.query(
      `SELECT * FROM jenis_mapel WHERE slug = $1 AND is_active = true`,
      [slug]
    );

    if (mapelResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mata pelajaran tidak ditemukan",
      });
    }

    const mapel = mapelResult.rows[0];

    // Get related mapel from same category (optional)
    const relatedResult = await db.query(
      `SELECT id, nama, slug, icon, color 
       FROM jenis_mapel 
       WHERE category = $1 AND id != $2 AND is_active = true 
       LIMIT 4`,
      [mapel.category, mapel.id]
    );

    res.json({
      success: true,
      data: {
        ...mapel,
        relatedMapel: relatedResult.rows,
      },
    });
  } catch (err) {
    console.error("Get mapel by slug error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data mata pelajaran",
    });
  }
});

// ============================================
// GET /api/kelas/categories - Get All Categories with Counts
// ============================================
router.get("/categories", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT category, COUNT(*) as count 
       FROM jenis_mapel 
       WHERE is_active = true 
       GROUP BY category 
       ORDER BY category ASC`
    );

    // Define all possible categories
    const categories = [
      { value: "all", label: "Semua", count: 0 },
      { value: "ipa", label: "IPA", count: 0 },
      { value: "ips", label: "IPS", count: 0 },
      { value: "bahasa", label: "Bahasa", count: 0 },
      { value: "umum", label: "Umum", count: 0 },
    ];

    let totalCount = 0;
    result.rows.forEach((row) => {
      const cat = categories.find((c) => c.value === row.category);
      if (cat) {
        cat.count = parseInt(row.count);
        totalCount += parseInt(row.count);
      }
    });

    // Set total count for "all" category
    categories[0].count = totalCount;

    // Only return categories that have items (except "all" which always shows)
    const filteredCategories = categories.filter(
      (c) => c.value === "all" || c.count > 0
    );

    res.json({
      success: true,
      data: filteredCategories,
    });
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kategori",
    });
  }
});

// ============================================
// GET /api/kelas/stats - Get Statistics
// ============================================
router.get("/stats", async (req, res) => {
  try {
    // Total mapel
    const totalResult = await db.query(
      `SELECT COUNT(*) as total FROM jenis_mapel WHERE is_active = true`
    );

    // Count by category
    const categoryResult = await db.query(
      `SELECT category, COUNT(*) as count 
       FROM jenis_mapel 
       WHERE is_active = true 
       GROUP BY category`
    );

    const stats = {
      total: parseInt(totalResult.rows[0].total),
      byCategory: {},
    };

    categoryResult.rows.forEach((row) => {
      stats.byCategory[row.category] = parseInt(row.count);
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil statistik",
    });
  }
});

// ============================================
// GET /api/kelas/search - Search Mata Pelajaran
// ============================================
router.get("/search", async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
        message: "Query too short",
      });
    }

    const result = await db.query(
      `SELECT id, nama, slug, icon, category, color
       FROM jenis_mapel 
       WHERE is_active = true 
         AND (LOWER(nama) LIKE LOWER($1) OR LOWER(deskripsi) LIKE LOWER($1))
       ORDER BY 
         CASE WHEN LOWER(nama) LIKE LOWER($2) THEN 0 ELSE 1 END,
         nama ASC
       LIMIT $3`,
      [`%${q}%`, `${q}%`, parseInt(limit)]
    );

    res.json({
      success: true,
      data: result.rows,
      query: q,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal melakukan pencarian",
    });
  }
});

module.exports = router;
