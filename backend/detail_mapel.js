// backend/detail_mapel.js
const express = require("express");
const router = express.Router();
const db = require("./db");
require("dotenv").config();

// ============================================
// SINGLE GRADIENT COLOR FOR ALL SUBJECTS
// ============================================
const DEFAULT_GRADIENT = "from-[#98c2ff] via-[#a894ed] to-[#df96ff]";

// ============================================
// GET /api/detail-mapel/:slug - Get Mapel Details with Sub Bab
// ============================================
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Get mapel info by slug
    const mapelResult = await db.query(
      `SELECT 
        id,
        nama,
        slug,
        deskripsi,
        icon,
        category,
        is_active,
        created_at
      FROM jenis_mapel 
      WHERE slug = $1 AND is_active = true`,
      [slug]
    );

    if (mapelResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mata pelajaran tidak ditemukan",
      });
    }

    const mapel = mapelResult.rows[0];

    // Get all sub_bab_mapel for this mapel - ADDED foto field
    const subBabResult = await db.query(
      `SELECT 
        id,
        id_mapel,
        nama_sub_bab,
        kode_sub_bab,
        bab_utama,
        urutan,
        deskripsi,
        tujuan,
        contoh,
        materi,
        video,
        foto,
        created_at
      FROM sub_bab_mapel 
      WHERE id_mapel = $1 
      ORDER BY urutan ASC, created_at ASC`,
      [mapel.id]
    );

    // Transform sub_bab_mapel to courses format for frontend - ADDED foto
    const courses = subBabResult.rows.map((subBab, index) => ({
      id: subBab.id,
      title: subBab.nama_sub_bab,
      category: subBab.bab_utama || "Umum",
      slug: subBab.kode_sub_bab,
      description: subBab.deskripsi || "",
      tujuan: subBab.tujuan || "",
      contoh: subBab.contoh || "",
      materi: subBab.materi || "",
      video: subBab.video || "",
      foto: subBab.foto || null, // Add foto field
      urutan: subBab.urutan || index + 1,
      teacher: getDefaultTeacher(index),
      duration: "30 Menit",
      image: `/assets/courses/${subBab.kode_sub_bab}.jpg`,
    }));

    res.json({
      success: true,
      data: {
        mapel: {
          id: mapel.id,
          nama: mapel.nama,
          slug: mapel.slug,
          deskripsi: mapel.deskripsi,
          icon: mapel.icon,
          category: mapel.category,
          color: mapel.color,
          gradient: DEFAULT_GRADIENT,
          grade: "Kelas 12",
        },
        courses: courses,
        totalCourses: courses.length,
      },
    });
  } catch (err) {
    console.error("Get detail mapel error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail mata pelajaran",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// ============================================
// GET /api/detail-mapel/:slug/sub-bab - Get Only Sub Bab for a Mapel
// ============================================
router.get("/:slug/sub-bab", async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit, offset, bab_utama } = req.query;

    // Verify mapel exists
    const mapelResult = await db.query(
      `SELECT id, slug, nama FROM jenis_mapel WHERE slug = $1 AND is_active = true`,
      [slug]
    );

    if (mapelResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mata pelajaran tidak ditemukan",
      });
    }

    const mapel = mapelResult.rows[0];

    // Build query for sub_bab - ADDED foto field
    let query = `
      SELECT 
        id,
        nama_sub_bab,
        kode_sub_bab,
        bab_utama,
        urutan,
        deskripsi,
        video,
        foto
      FROM sub_bab_mapel 
      WHERE id_mapel = $1
    `;
    const params = [mapel.id];
    let paramCount = 1;

    // Filter by bab_utama if provided
    if (bab_utama) {
      paramCount++;
      query += ` AND bab_utama = $${paramCount}`;
      params.push(bab_utama);
    }

    query += ` ORDER BY urutan ASC, created_at ASC`;

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

    const subBabResult = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM sub_bab_mapel WHERE id_mapel = $1`;
    const countParams = [mapel.id];

    if (bab_utama) {
      countQuery += ` AND bab_utama = $2`;
      countParams.push(bab_utama);
    }

    const countResult = await db.query(countQuery, countParams);

    // Transform data - ADDED foto
    const courses = subBabResult.rows.map((subBab, index) => ({
      id: subBab.id,
      title: subBab.nama_sub_bab,
      category: subBab.bab_utama || "Umum",
      slug: subBab.kode_sub_bab,
      description: subBab.deskripsi || "",
      video: subBab.video || "",
      foto: subBab.foto || null,
      urutan: subBab.urutan || index + 1,
      teacher: getDefaultTeacher(index),
      duration: "30 Menit",
      image: `/assets/courses/${subBab.kode_sub_bab}.jpg`,
    }));

    res.json({
      success: true,
      data: courses,
      total: parseInt(countResult.rows[0].total),
      mapel: {
        id: mapel.id,
        nama: mapel.nama,
        slug: mapel.slug,
      },
    });
  } catch (err) {
    console.error("Get sub bab error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data sub bab",
    });
  }
});

// ============================================
// GET /api/detail-mapel/:slug/sub-bab/:kode - Get Single Sub Bab Detail
// ============================================
router.get("/:slug/sub-bab/:kode", async (req, res) => {
  try {
    const { slug, kode } = req.params;

    // Verify mapel exists
    const mapelResult = await db.query(
      `SELECT id, nama, slug, icon, category, color 
       FROM jenis_mapel 
       WHERE slug = $1 AND is_active = true`,
      [slug]
    );

    if (mapelResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mata pelajaran tidak ditemukan",
      });
    }

    const mapel = mapelResult.rows[0];

    // Get specific sub_bab - ADDED foto field
    const subBabResult = await db.query(
      `SELECT 
        id,
        id_mapel,
        nama_sub_bab,
        kode_sub_bab,
        bab_utama,
        urutan,
        deskripsi,
        tujuan,
        contoh,
        materi,
        video,
        foto,
        created_at
      FROM sub_bab_mapel 
      WHERE id_mapel = $1 AND kode_sub_bab = $2`,
      [mapel.id, kode]
    );

    if (subBabResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sub bab tidak ditemukan",
      });
    }

    const subBab = subBabResult.rows[0];

    // Get previous and next sub_bab for navigation
    const navResult = await db.query(
      `SELECT 
        id, nama_sub_bab, kode_sub_bab, urutan
      FROM sub_bab_mapel 
      WHERE id_mapel = $1 
      ORDER BY urutan ASC`,
      [mapel.id]
    );

    const allSubBab = navResult.rows;
    const currentIndex = allSubBab.findIndex(
      (s) => s.kode_sub_bab === subBab.kode_sub_bab
    );

    const prevSubBab = currentIndex > 0 ? allSubBab[currentIndex - 1] : null;
    const nextSubBab =
      currentIndex < allSubBab.length - 1 ? allSubBab[currentIndex + 1] : null;

    res.json({
      success: true,
      data: {
        mapel: {
          id: mapel.id,
          nama: mapel.nama,
          slug: mapel.slug,
          icon: mapel.icon,
          category: mapel.category,
          color: mapel.color,
          gradient: DEFAULT_GRADIENT,
        },
        subBab: {
          id: subBab.id,
          title: subBab.nama_sub_bab,
          slug: subBab.kode_sub_bab,
          category: subBab.bab_utama || "Umum",
          description: subBab.deskripsi || "",
          tujuan: subBab.tujuan || "",
          contoh: subBab.contoh || "",
          materi: subBab.materi || "",
          video: subBab.video || "",
          foto: subBab.foto || null, // Add foto field
          urutan: subBab.urutan,
          teacher: getDefaultTeacher(subBab.id),
          duration: "30 Menit",
          image: `/assets/courses/${subBab.kode_sub_bab}.jpg`,
        },
        navigation: {
          prev: prevSubBab
            ? {
                title: prevSubBab.nama_sub_bab,
                slug: prevSubBab.kode_sub_bab,
              }
            : null,
          next: nextSubBab
            ? {
                title: nextSubBab.nama_sub_bab,
                slug: nextSubBab.kode_sub_bab,
              }
            : null,
          totalSubBab: allSubBab.length,
          currentIndex: currentIndex + 1,
        },
      },
    });
  } catch (err) {
    console.error("Get sub bab detail error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail sub bab",
    });
  }
});

// ============================================
// GET /api/detail-mapel/:slug/bab-utama - Get All Unique Bab Utama
// ============================================
router.get("/:slug/bab-utama", async (req, res) => {
  try {
    const { slug } = req.params;

    const mapelResult = await db.query(
      `SELECT id FROM jenis_mapel WHERE slug = $1 AND is_active = true`,
      [slug]
    );

    if (mapelResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mata pelajaran tidak ditemukan",
      });
    }

    const mapel = mapelResult.rows[0];

    const babResult = await db.query(
      `SELECT 
        bab_utama, 
        COUNT(*) as count 
      FROM sub_bab_mapel 
      WHERE id_mapel = $1 AND bab_utama IS NOT NULL
      GROUP BY bab_utama 
      ORDER BY bab_utama ASC`,
      [mapel.id]
    );

    const babUtama = babResult.rows.map((row) => ({
      name: row.bab_utama,
      count: parseInt(row.count),
    }));

    res.json({
      success: true,
      data: babUtama,
    });
  } catch (err) {
    console.error("Get bab utama error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data bab utama",
    });
  }
});

// ============================================
// Helper Functions
// ============================================
function getDefaultTeacher(index) {
  const teachers = [
    "Pak Budi",
    "Bu Sari",
    "Pak Andi",
    "Bu Maya",
    "Pak Hendra",
    "Bu Ratna",
    "Pak Wawan",
    "Bu Lisa",
    "Pak Agus",
    "Bu Dewi",
    "Pak Dedi",
    "Bu Rina",
  ];
  return teachers[index % teachers.length];
}

module.exports = router;
