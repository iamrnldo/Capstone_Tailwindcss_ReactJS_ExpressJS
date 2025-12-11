// backend/dashboard.js
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
// GET /api/dashboard/mapel - Get All Mata Pelajaran
// ============================================
router.get("/mapel", async (req, res) => {
  try {
    const { category, search, limit, offset } = req.query;

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

    // Search by name
    if (search) {
      paramCount++;
      query += ` AND LOWER(nama) LIKE LOWER($${paramCount})`;
      params.push(`%${search}%`);
    }

    // Order by name
    query += ` ORDER BY nama ASC`;

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

    // Get total count
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
      countQuery += ` AND LOWER(nama) LIKE LOWER($${countParamNum})`;
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
// GET /api/dashboard/mapel/:slug - Get Single Mata Pelajaran
// ============================================
// Handle mapel click - navigates to detail_mapel page
const handleMapelClick = (slug) => {
  navigate(`/mapel/${slug}`);
};

router.get("/mapel/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await db.query(
      `SELECT * FROM jenis_mapel WHERE slug = $1 AND is_active = true`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mata pelajaran tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
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
// GET /api/dashboard/categories - Get All Categories
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

    categories[0].count = totalCount;

    res.json({
      success: true,
      data: categories.filter((c) => c.value === "all" || c.count > 0),
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
// GET /api/dashboard/rekomendasi-belajar - Get Learning Recommendations
// ============================================
router.get("/rekomendasi-belajar", optionalAuth, async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Static data for now - replace with database query when you have materi table
    const recommendations = [
      {
        id: 1,
        title: "Program Linear",
        category: "Optimasi",
        instructor: "Pak Nathan",
        duration: "30 Menit",
        image: "programlinear",
        slug: "program-linear",
      },
      {
        id: 2,
        title: "Surat Lamaran Kerja",
        category: "Surat Resmi",
        instructor: "Pak Hahan",
        duration: "30 Menit",
        image: "suratlamarankerja",
        slug: "surat-lamaran-kerja",
      },
      {
        id: 3,
        title: "Dimensi Tiga",
        category: "Kalkulus",
        instructor: "Pak Nathan",
        duration: "30 Menit",
        image: "dimensi3",
        slug: "dimensi-tiga",
      },
      {
        id: 4,
        title: "Vektor dalam Ruang Dimensi Tiga",
        category: "Aljabar",
        instructor: "Bu Cia",
        duration: "30 Menit",
        image: "dimensi3vector",
        slug: "vektor-dimensi-tiga",
      },
      {
        id: 5,
        title: "Matriks dan Transformasi Linear",
        category: "Aljabar Linear",
        instructor: "Bu Atika",
        duration: "40 Menit",
        image: "matriks",
        slug: "matriks-transformasi",
      },
      {
        id: 6,
        title: "Program Linear",
        category: "Optimasi",
        instructor: "Bu Dilla",
        duration: "15 Menit",
        image: "programlinear1",
        slug: "program-linear-2",
      },
    ];

    res.json({
      success: true,
      data: recommendations.slice(0, parseInt(limit)),
    });
  } catch (err) {
    console.error("Get rekomendasi belajar error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil rekomendasi belajar",
    });
  }
});

// ============================================
// GET /api/dashboard/rekomendasi-latihan - Get Quiz Recommendations
// ============================================
router.get("/rekomendasi-latihan", optionalAuth, async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Static data - replace with database query when ready
    const quizzes = [
      {
        id: 1,
        title: "Persamaan & Pertidaksamaan Lingkaran",
        mapel: "Matematika Peminatan",
        mapelColor: "bg-purple-500",
        totalSoal: 30,
        difficulty: "Mudah",
        slug: "persamaan-lingkaran",
      },
      {
        id: 2,
        title: "Perbandingan Trigonometri pada Segitiga",
        mapel: "Matematika Wajib",
        mapelColor: "bg-blue-600",
        totalSoal: 30,
        difficulty: "Mudah",
        slug: "trigonometri-segitiga",
      },
      {
        id: 3,
        title: "Menganalisis Teks Editorial",
        mapel: "Bahasa Indonesia",
        mapelColor: "bg-rose-400",
        totalSoal: 30,
        difficulty: "Mudah",
        slug: "teks-editorial",
      },
      {
        id: 4,
        title: "Genetika: Persilangan & Pewarisan",
        mapel: "Biologi",
        mapelColor: "bg-emerald-500",
        totalSoal: 30,
        difficulty: "Mudah",
        slug: "genetika",
      },
      {
        id: 5,
        title: "Fluida Dinamis & Statika Fluida",
        mapel: "Fisika",
        mapelColor: "bg-amber-400",
        totalSoal: 30,
        difficulty: "Mudah",
        slug: "fluida",
      },
      {
        id: 6,
        title: "Reading Comprehension – Narrative Text",
        mapel: "Bahasa Inggris",
        mapelColor: "bg-pink-400",
        totalSoal: 30,
        difficulty: "Mudah",
        slug: "narrative-text",
      },
    ];

    res.json({
      success: true,
      data: quizzes.slice(0, parseInt(limit)),
    });
  } catch (err) {
    console.error("Get rekomendasi latihan error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil rekomendasi latihan",
    });
  }
});

module.exports = router;
