// backend/materi.js

const express = require("express");
const router = express.Router();
const db = require("./db");
const jwt = require("jsonwebtoken");

// JWT authentication middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    req.user = decoded;
    next();
  });
}

// ============================================
// GET /api/materi/:slug - Get materi by kode_sub_bab (slug)
// ============================================
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Query sub_bab_mapel with jenis_mapel join
    const materiResult = await db.query(
      `SELECT 
        sbm.id,
        sbm.nama_sub_bab as title,
        sbm.kode_sub_bab as slug,
        sbm.deskripsi,
        sbm.materi as konten,
        sbm.foto,
        sbm.video as video_url,
        sbm.bab_utama,
        sbm.urutan,
        sbm.tujuan,
        sbm.contoh,
        sbm.created_at,
        sbm.updated_at,
        jm.id as mapel_id,
        jm.nama as mapel_nama,
        jm.slug as mapel_slug,
        jm.icon as mapel_icon,
        jm.color as mapel_color,
        jm.deskripsi as mapel_deskripsi
      FROM sub_bab_mapel sbm
      LEFT JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      WHERE sbm.kode_sub_bab = $1`,
      [slug]
    );

    if (materiResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Materi tidak ditemukan",
      });
    }

    const materi = materiResult.rows[0];

    // Format response
    const formattedMateri = {
      id: materi.id,
      title: materi.title,
      slug: materi.slug,
      deskripsi: materi.deskripsi,
      konten: materi.konten,
      foto: materi.foto,
      videoUrl: materi.video_url,
      babUtama: materi.bab_utama,
      urutan: materi.urutan,
      tujuan: materi.tujuan,
      contoh: materi.contoh,
      instructor: "Guru Pengajar", // Default value since not in schema
      duration: "30 Menit", // Default value since not in schema
      createdAt: materi.created_at,
      updatedAt: materi.updated_at,
      mapel: materi.mapel_id
        ? {
            id: materi.mapel_id,
            nama: materi.mapel_nama,
            slug: materi.mapel_slug,
            icon: materi.mapel_icon,
            color: materi.mapel_color,
            deskripsi: materi.mapel_deskripsi,
          }
        : null,
      bab: materi.bab_utama
        ? {
            nama: materi.bab_utama,
          }
        : null,
    };

    // Get related materi from same mapel
    const relatedResult = await db.query(
      `SELECT 
        id, 
        nama_sub_bab as title, 
        kode_sub_bab as slug, 
        foto,
        deskripsi
       FROM sub_bab_mapel
       WHERE id_mapel = $1 AND id != $2
       ORDER BY urutan ASC
       LIMIT 4`,
      [materi.mapel_id, materi.id]
    );

    // Count soal for this sub_bab
    const soalCountResult = await db.query(
      `SELECT COUNT(*) as total FROM soal WHERE id_sub_bab = $1`,
      [materi.id]
    );

    res.json({
      success: true,
      data: {
        ...formattedMateri,
        totalSoal: parseInt(soalCountResult.rows[0]?.total || 0),
        relatedMateri: relatedResult.rows.map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          foto: row.foto,
          deskripsi: row.deskripsi,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching materi:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat materi",
      error: error.message,
    });
  }
});

// ============================================
// GET /api/materi - Get all materi with filters
// ============================================
router.get("/", async (req, res) => {
  try {
    const {
      mapel_id,
      mapel_slug,
      bab_utama,
      search,
      limit = 10,
      page = 1,
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT 
        sbm.id,
        sbm.nama_sub_bab as title,
        sbm.kode_sub_bab as slug,
        sbm.deskripsi,
        sbm.foto,
        sbm.bab_utama,
        sbm.urutan,
        sbm.video,
        sbm.created_at,
        jm.id as mapel_id,
        jm.nama as mapel_nama,
        jm.slug as mapel_slug,
        jm.color as mapel_color,
        jm.icon as mapel_icon
      FROM sub_bab_mapel sbm
      LEFT JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (mapel_id) {
      paramCount++;
      query += ` AND sbm.id_mapel = $${paramCount}`;
      params.push(mapel_id);
    }

    if (mapel_slug) {
      paramCount++;
      query += ` AND jm.slug = $${paramCount}`;
      params.push(mapel_slug);
    }

    if (bab_utama) {
      paramCount++;
      query += ` AND sbm.bab_utama = $${paramCount}`;
      params.push(bab_utama);
    }

    if (search) {
      paramCount++;
      query += ` AND (sbm.nama_sub_bab ILIKE $${paramCount} OR sbm.deskripsi ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Count total
    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      "SELECT COUNT(*) as total FROM"
    );
    const countResult = await db.query(countQuery, params);
    const total = parseInt(countResult.rows[0]?.total || 0);

    // Add ordering and pagination
    query += ` ORDER BY sbm.urutan ASC, sbm.created_at DESC`;

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await db.query(query, params);

    // Format results
    const materis = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      deskripsi: row.deskripsi,
      foto: row.foto,
      babUtama: row.bab_utama,
      urutan: row.urutan,
      hasVideo: !!row.video,
      createdAt: row.created_at,
      mapel: row.mapel_id
        ? {
            id: row.mapel_id,
            nama: row.mapel_nama,
            slug: row.mapel_slug,
            color: row.mapel_color,
            icon: row.mapel_icon,
          }
        : null,
    }));

    res.json({
      success: true,
      data: materis,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching all materi:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat daftar materi",
      error: error.message,
    });
  }
});

// ============================================
// GET /api/materi/mapel/:mapelSlug - Get materi by mapel slug
// ============================================
router.get("/mapel/:mapelSlug", async (req, res) => {
  try {
    const { mapelSlug } = req.params;
    const { bab_utama, limit = 20 } = req.query;

    // First get the mapel
    const mapelResult = await db.query(
      `SELECT id, nama, slug, deskripsi, icon, color 
       FROM jenis_mapel 
       WHERE slug = $1 AND is_active = true`,
      [mapelSlug]
    );

    if (mapelResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mata pelajaran tidak ditemukan",
      });
    }

    const mapel = mapelResult.rows[0];

    // Get materi for this mapel
    let materiQuery = `
      SELECT 
        sbm.id,
        sbm.nama_sub_bab as title,
        sbm.kode_sub_bab as slug,
        sbm.deskripsi,
        sbm.foto,
        sbm.bab_utama,
        sbm.urutan,
        sbm.video,
        sbm.tujuan,
        (SELECT COUNT(*) FROM soal WHERE id_sub_bab = sbm.id) as total_soal
      FROM sub_bab_mapel sbm
      WHERE sbm.id_mapel = $1
    `;

    const params = [mapel.id];
    let paramCount = 1;

    if (bab_utama) {
      paramCount++;
      materiQuery += ` AND sbm.bab_utama = $${paramCount}`;
      params.push(bab_utama);
    }

    materiQuery += ` ORDER BY sbm.bab_utama, sbm.urutan ASC LIMIT $${
      paramCount + 1
    }`;
    params.push(parseInt(limit));

    const materiResult = await db.query(materiQuery, params);

    // Get unique bab_utama for this mapel
    const babResult = await db.query(
      `SELECT DISTINCT bab_utama 
       FROM sub_bab_mapel 
       WHERE id_mapel = $1 AND bab_utama IS NOT NULL
       ORDER BY bab_utama`,
      [mapel.id]
    );

    res.json({
      success: true,
      data: {
        mapel: {
          id: mapel.id,
          nama: mapel.nama,
          slug: mapel.slug,
          deskripsi: mapel.deskripsi,
          icon: mapel.icon,
          color: mapel.color,
        },
        babList: babResult.rows.map((row) => row.bab_utama),
        materi: materiResult.rows.map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          deskripsi: row.deskripsi,
          foto: row.foto,
          babUtama: row.bab_utama,
          urutan: row.urutan,
          hasVideo: !!row.video,
          tujuan: row.tujuan,
          totalSoal: parseInt(row.total_soal || 0),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching materi by mapel:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat materi",
      error: error.message,
    });
  }
});

module.exports = router;
