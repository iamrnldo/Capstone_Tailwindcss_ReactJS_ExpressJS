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
// GET /api/dashboard/rekomendasi-belajar - Get Learning Recommendations from Database
// ============================================
router.get("/rekomendasi-belajar", optionalAuth, async (req, res) => {
  try {
    const { limit = 6, mapel_id, category, random = true } = req.query;

    let query = `
      SELECT 
        sbm.id,
        sbm.nama_sub_bab as title,
        sbm.kode_sub_bab as slug,
        sbm.bab_utama as category,
        sbm.deskripsi,
        sbm.tujuan,
        sbm.materi,
        sbm.video,
        sbm.foto,
        sbm.urutan,
        sbm.created_at,
        jm.id as mapel_id,
        jm.nama as mapel_nama,
        jm.slug as mapel_slug,
        jm.color as mapel_color,
        jm.icon as mapel_icon
      FROM sub_bab_mapel sbm
      INNER JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      WHERE jm.is_active = true
    `;

    const params = [];
    let paramCount = 0;

    // Filter by specific mapel
    if (mapel_id) {
      paramCount++;
      query += ` AND sbm.id_mapel = $${paramCount}`;
      params.push(parseInt(mapel_id));
    }

    // Filter by category (IPA, IPS, etc.)
    if (category && category !== "all") {
      paramCount++;
      query += ` AND jm.category = $${paramCount}`;
      params.push(category);
    }

    // Order by random or by urutan
    if (random === "true" || random === true) {
      query += ` ORDER BY RANDOM()`;
    } else {
      query += ` ORDER BY sbm.urutan ASC, sbm.created_at DESC`;
    }

    // Limit results
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    const result = await db.query(query, params);

    // Transform data to match frontend expectations
    const recommendations = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      category: row.category || row.mapel_nama,
      instructor: `Guru ${row.mapel_nama}`,
      duration: "30 Menit",
      foto: row.foto,
      image: row.foto,
      deskripsi: row.deskripsi,
      tujuan: row.tujuan,
      video: row.video,
      mapel: {
        id: row.mapel_id,
        nama: row.mapel_nama,
        slug: row.mapel_slug,
        color: row.mapel_color,
        icon: row.mapel_icon,
      },
    }));

    // Get total count for pagination info
    let countQuery = `
      SELECT COUNT(*) as total
      FROM sub_bab_mapel sbm
      INNER JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      WHERE jm.is_active = true
    `;
    const countParams = [];
    let countParamNum = 0;

    if (mapel_id) {
      countParamNum++;
      countQuery += ` AND sbm.id_mapel = $${countParamNum}`;
      countParams.push(parseInt(mapel_id));
    }

    if (category && category !== "all") {
      countParamNum++;
      countQuery += ` AND jm.category = $${countParamNum}`;
      countParams.push(category);
    }

    const countResult = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: recommendations,
      total: parseInt(countResult.rows[0].total),
      message: "Rekomendasi belajar berhasil diambil",
    });
  } catch (err) {
    console.error("Get rekomendasi belajar error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil rekomendasi belajar",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// ============================================
// GET /api/dashboard/rekomendasi-latihan - Get Quiz Recommendations from Database
// ============================================
router.get("/rekomendasi-latihan", optionalAuth, async (req, res) => {
  try {
    const { limit = 6, mapel_id, category, random = true } = req.query;

    let query = `
      SELECT 
        sbm.id,
        sbm.nama_sub_bab as title,
        sbm.kode_sub_bab as slug,
        sbm.bab_utama as bab_utama,
        sbm.foto,
        sbm.deskripsi,
        jm.id as mapel_id,
        jm.nama as mapel_nama,
        jm.slug as mapel_slug,
        jm.color as mapel_color,
        jm.icon as mapel_icon,
        jm.category as mapel_category,
        COUNT(s.id) as total_soal,
        CASE 
          WHEN AVG(s.bobot_nilai) <= 1 THEN 'Mudah'
          WHEN AVG(s.bobot_nilai) <= 2 THEN 'Sedang'
          ELSE 'Sulit'
        END as difficulty,
        COALESCE(AVG(s.waktu_pengerjaan), 60) as avg_waktu
      FROM sub_bab_mapel sbm
      INNER JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      LEFT JOIN soal s ON s.id_sub_bab = sbm.id
      WHERE jm.is_active = true
    `;

    const params = [];
    let paramCount = 0;

    // Filter by specific mapel
    if (mapel_id) {
      paramCount++;
      query += ` AND sbm.id_mapel = $${paramCount}`;
      params.push(parseInt(mapel_id));
    }

    // Filter by category (IPA, IPS, etc.)
    if (category && category !== "all") {
      paramCount++;
      query += ` AND jm.category = $${paramCount}`;
      params.push(category);
    }

    // Group by clause
    query += `
      GROUP BY 
        sbm.id, 
        sbm.nama_sub_bab, 
        sbm.kode_sub_bab, 
        sbm.bab_utama,
        sbm.foto,
        sbm.deskripsi,
        jm.id, 
        jm.nama, 
        jm.slug, 
        jm.color, 
        jm.icon,
        jm.category
      HAVING COUNT(s.id) > 0
    `;

    // Order by random or by total soal
    if (random === "true" || random === true) {
      query += ` ORDER BY RANDOM()`;
    } else {
      query += ` ORDER BY total_soal DESC, sbm.nama_sub_bab ASC`;
    }

    // Limit results
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    const result = await db.query(query, params);

    // Transform data to match frontend expectations
    const quizzes = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      mapel: row.mapel_nama,
      mapelSlug: row.mapel_slug,
      mapelColor: row.mapel_color,
      mapelIcon: row.mapel_icon,
      category: row.mapel_category,
      babUtama: row.bab_utama,
      totalSoal: parseInt(row.total_soal),
      difficulty: row.difficulty,
      avgWaktu: Math.round(row.avg_waktu),
      foto: row.foto,
      deskripsi: row.deskripsi,
    }));

    // Get total count for pagination info
    let countQuery = `
      SELECT COUNT(DISTINCT sbm.id) as total
      FROM sub_bab_mapel sbm
      INNER JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      INNER JOIN soal s ON s.id_sub_bab = sbm.id
      WHERE jm.is_active = true
    `;
    const countParams = [];
    let countParamNum = 0;

    if (mapel_id) {
      countParamNum++;
      countQuery += ` AND sbm.id_mapel = $${countParamNum}`;
      countParams.push(parseInt(mapel_id));
    }

    if (category && category !== "all") {
      countParamNum++;
      countQuery += ` AND jm.category = $${countParamNum}`;
      countParams.push(category);
    }

    const countResult = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: quizzes,
      total: parseInt(countResult.rows[0].total),
      message: "Rekomendasi latihan berhasil diambil",
    });
  } catch (err) {
    console.error("Get rekomendasi latihan error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil rekomendasi latihan",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// ============================================
// GET /api/dashboard/latihan/:slug - Get Quiz Detail by Slug
// ============================================
router.get("/latihan/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Get sub_bab info with question count
    const subBabResult = await db.query(
      `
      SELECT 
        sbm.*,
        jm.nama as mapel_nama,
        jm.slug as mapel_slug,
        jm.color as mapel_color,
        jm.icon as mapel_icon,
        jm.category as mapel_category,
        COUNT(s.id) as total_soal,
        COALESCE(SUM(s.waktu_pengerjaan), COUNT(s.id) * 60) as total_waktu
      FROM sub_bab_mapel sbm
      INNER JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      LEFT JOIN soal s ON s.id_sub_bab = sbm.id
      WHERE sbm.kode_sub_bab = $1 AND jm.is_active = true
      GROUP BY sbm.id, jm.id, jm.nama, jm.slug, jm.color, jm.icon, jm.category
      `,
      [slug]
    );

    if (subBabResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Latihan tidak ditemukan",
      });
    }

    const subBab = subBabResult.rows[0];

    // Get all questions for this sub_bab
    const soalResult = await db.query(
      `
      SELECT 
        id,
        kode_soal,
        tipe_soal,
        pertanyaan,
        pilihan_a,
        pilihan_b,
        pilihan_c,
        pilihan_d,
        pilihan_e,
        bobot_nilai,
        waktu_pengerjaan,
        gambar_soal
      FROM soal
      WHERE id_sub_bab = $1
      ORDER BY kode_soal ASC
      `,
      [subBab.id]
    );

    res.json({
      success: true,
      data: {
        id: subBab.id,
        title: subBab.nama_sub_bab,
        slug: subBab.kode_sub_bab,
        babUtama: subBab.bab_utama,
        deskripsi: subBab.deskripsi,
        foto: subBab.foto,
        totalSoal: parseInt(subBab.total_soal),
        totalWaktu: parseInt(subBab.total_waktu),
        mapel: {
          id: subBab.id_mapel,
          nama: subBab.mapel_nama,
          slug: subBab.mapel_slug,
          color: subBab.mapel_color,
          icon: subBab.mapel_icon,
          category: subBab.mapel_category,
        },
        soal: soalResult.rows.map((s) => ({
          id: s.id,
          kode: s.kode_soal,
          tipe: s.tipe_soal,
          pertanyaan: s.pertanyaan,
          pilihan: {
            a: s.pilihan_a,
            b: s.pilihan_b,
            c: s.pilihan_c,
            d: s.pilihan_d,
            e: s.pilihan_e,
          },
          bobot: s.bobot_nilai,
          waktu: s.waktu_pengerjaan,
          gambar: s.gambar_soal,
        })),
      },
    });
  } catch (err) {
    console.error("Get latihan detail error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail latihan",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// ============================================
// GET /api/dashboard/sub-bab/:slug - Get Single Sub Bab Detail
// ============================================
router.get("/sub-bab/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await db.query(
      `
      SELECT 
        sbm.*,
        jm.nama as mapel_nama,
        jm.slug as mapel_slug,
        jm.color as mapel_color,
        jm.icon as mapel_icon,
        jm.category as mapel_category
      FROM sub_bab_mapel sbm
      INNER JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      WHERE sbm.kode_sub_bab = $1 AND jm.is_active = true
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Materi tidak ditemukan",
      });
    }

    const row = result.rows[0];

    // Get related sub bab from same mapel
    const relatedResult = await db.query(
      `
      SELECT 
        sbm.id,
        sbm.nama_sub_bab as title,
        sbm.kode_sub_bab as slug,
        sbm.bab_utama as category,
        sbm.foto,
        jm.nama as mapel_nama
      FROM sub_bab_mapel sbm
      INNER JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      WHERE sbm.id_mapel = $1 
        AND sbm.id != $2 
        AND jm.is_active = true
      ORDER BY sbm.urutan ASC
      LIMIT 4
      `,
      [row.id_mapel, row.id]
    );

    res.json({
      success: true,
      data: {
        id: row.id,
        title: row.nama_sub_bab,
        slug: row.kode_sub_bab,
        category: row.bab_utama,
        deskripsi: row.deskripsi,
        tujuan: row.tujuan,
        contoh: row.contoh,
        materi: row.materi,
        video: row.video,
        foto: row.foto,
        urutan: row.urutan,
        mapel: {
          id: row.id_mapel,
          nama: row.mapel_nama,
          slug: row.mapel_slug,
          color: row.mapel_color,
          icon: row.mapel_icon,
          category: row.mapel_category,
        },
        related: relatedResult.rows.map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          category: r.category,
          foto: r.foto,
          mapel: r.mapel_nama,
        })),
      },
    });
  } catch (err) {
    console.error("Get sub bab detail error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail materi",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
