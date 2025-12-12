// backend/latihan.js

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
// GET /api/latihan/:slug/soal - Get soal by sub_bab kode_sub_bab (slug)
// ============================================
router.get("/:slug/soal", async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 20, shuffle = "false", tipe_soal } = req.query;

    // Find sub_bab_mapel by kode_sub_bab (slug)
    const subBabResult = await db.query(
      `SELECT 
        sbm.id, 
        sbm.nama_sub_bab as title, 
        sbm.kode_sub_bab as slug,
        sbm.bab_utama,
        sbm.deskripsi,
        jm.id as mapel_id, 
        jm.nama as mapel_nama, 
        jm.slug as mapel_slug,
        jm.color as mapel_color,
        jm.icon as mapel_icon
       FROM sub_bab_mapel sbm
       LEFT JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
       WHERE sbm.kode_sub_bab = $1`,
      [slug]
    );

    if (subBabResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Sub bab tidak ditemukan",
      });
    }

    const subBab = subBabResult.rows[0];

    // Build soal query
    let soalQuery = `
      SELECT 
        s.id,
        s.kode_soal,
        s.tipe_soal,
        s.pertanyaan,
        s.pilihan_a,
        s.pilihan_b,
        s.pilihan_c,
        s.pilihan_d,
        s.pilihan_e,
        s.pembahasan,
        s.bobot_nilai,
        s.waktu_pengerjaan,
        s.gambar_soal
      FROM soal s
      WHERE s.id_sub_bab = $1
    `;

    const params = [subBab.id];
    let paramCount = 1;

    // Filter by tipe_soal if provided
    if (tipe_soal) {
      paramCount++;
      soalQuery += ` AND s.tipe_soal = $${paramCount}`;
      params.push(tipe_soal);
    }

    // Order by random or by id
    if (shuffle === "true") {
      soalQuery += ` ORDER BY RANDOM()`;
    } else {
      soalQuery += ` ORDER BY s.id ASC`;
    }

    // Add limit
    paramCount++;
    soalQuery += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    const soalResult = await db.query(soalQuery, params);

    // Format soal - DON'T send jawaban_benar to frontend for security
    const soalList = soalResult.rows.map((soal, index) => ({
      id: soal.id,
      kodeSoal: soal.kode_soal,
      tipeSoal: soal.tipe_soal,
      pertanyaan: soal.pertanyaan,
      opsiA: soal.pilihan_a,
      opsiB: soal.pilihan_b,
      opsiC: soal.pilihan_c,
      opsiD: soal.pilihan_d,
      opsiE: soal.pilihan_e,
      pembahasan: soal.pembahasan,
      bobotNilai: soal.bobot_nilai || 1,
      waktuPengerjaan: soal.waktu_pengerjaan,
      gambarSoal: soal.gambar_soal,
      difficulty: getDifficultyFromBobot(soal.bobot_nilai),
      urutan: index + 1,
    }));

    // Calculate total waktu
    const totalWaktu = soalList.reduce(
      (acc, soal) => acc + (soal.waktuPengerjaan || 2),
      0
    );

    res.json({
      success: true,
      data: soalList,
      latihan: {
        id: subBab.id,
        title: subBab.title,
        slug: subBab.slug,
        babUtama: subBab.bab_utama,
        deskripsi: subBab.deskripsi,
        totalSoal: soalList.length,
        waktu: totalWaktu,
      },
      materi: {
        id: subBab.id,
        title: subBab.title,
        slug: subBab.slug,
        mapel: subBab.mapel_id
          ? {
              id: subBab.mapel_id,
              nama: subBab.mapel_nama,
              slug: subBab.mapel_slug,
              color: subBab.mapel_color,
              icon: subBab.mapel_icon,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching soal:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat soal latihan",
      error: error.message,
    });
  }
});

// ============================================
// GET /api/latihan/:slug - Get latihan details by slug
// ============================================
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const subBabResult = await db.query(
      `SELECT 
        sbm.id,
        sbm.nama_sub_bab as title,
        sbm.kode_sub_bab as slug,
        sbm.deskripsi,
        sbm.bab_utama,
        sbm.tujuan,
        sbm.created_at,
        jm.id as mapel_id,
        jm.nama as mapel_nama,
        jm.slug as mapel_slug,
        jm.color as mapel_color,
        jm.icon as mapel_icon
      FROM sub_bab_mapel sbm
      LEFT JOIN jenis_mapel jm ON sbm.id_mapel = jm.id
      WHERE sbm.kode_sub_bab = $1`,
      [slug]
    );

    if (subBabResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Latihan tidak ditemukan",
      });
    }

    const subBab = subBabResult.rows[0];

    // Count soal and get stats
    const statsResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(COALESCE(waktu_pengerjaan, 2)) as total_waktu,
        AVG(bobot_nilai) as avg_bobot,
        COUNT(DISTINCT tipe_soal) as jumlah_tipe
       FROM soal 
       WHERE id_sub_bab = $1`,
      [subBab.id]
    );

    const stats = statsResult.rows[0];

    // Get tipe soal breakdown
    const tipeSoalResult = await db.query(
      `SELECT tipe_soal, COUNT(*) as jumlah
       FROM soal
       WHERE id_sub_bab = $1
       GROUP BY tipe_soal`,
      [subBab.id]
    );

    res.json({
      success: true,
      data: {
        id: subBab.id,
        title: subBab.title,
        slug: subBab.slug,
        deskripsi: subBab.deskripsi,
        babUtama: subBab.bab_utama,
        tujuan: subBab.tujuan,
        totalSoal: parseInt(stats.total || 0),
        waktu: parseInt(stats.total_waktu || 0),
        difficulty: getDifficultyFromBobot(parseFloat(stats.avg_bobot || 1)),
        tipeSoal: tipeSoalResult.rows.map((row) => ({
          tipe: row.tipe_soal,
          jumlah: parseInt(row.jumlah),
        })),
        createdAt: subBab.created_at,
        materi: {
          id: subBab.id,
          title: subBab.title,
          slug: subBab.slug,
          mapel: subBab.mapel_id
            ? {
                id: subBab.mapel_id,
                nama: subBab.mapel_nama,
                slug: subBab.mapel_slug,
                color: subBab.mapel_color,
                icon: subBab.mapel_icon,
              }
            : null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching latihan:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat latihan",
      error: error.message,
    });
  }
});

// ============================================
// POST /api/latihan/:slug/submit - Submit jawaban
// ============================================
router.post("/:slug/submit", authenticateJWT, async (req, res) => {
  try {
    const { slug } = req.params;
    const { jawaban } = req.body; // Array of { soalId, jawaban }
    const userId = req.user.id;

    if (!jawaban || !Array.isArray(jawaban)) {
      return res.status(400).json({
        success: false,
        message: "Format jawaban tidak valid",
      });
    }

    // Get sub_bab
    const subBabResult = await db.query(
      `SELECT id, nama_sub_bab as title FROM sub_bab_mapel WHERE kode_sub_bab = $1`,
      [slug]
    );

    if (subBabResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Latihan tidak ditemukan",
      });
    }

    const subBab = subBabResult.rows[0];

    // Get all soal with jawaban_benar for this sub_bab
    const soalIds = jawaban.map((j) => j.soalId);
    const soalResult = await db.query(
      `SELECT id, jawaban_benar, bobot_nilai, pembahasan
       FROM soal
       WHERE id = ANY($1) AND id_sub_bab = $2`,
      [soalIds, subBab.id]
    );

    // Create a map for quick lookup
    const soalMap = {};
    soalResult.rows.forEach((soal) => {
      soalMap[soal.id] = soal;
    });

    // Calculate score
    let totalBenar = 0;
    let totalSalah = 0;
    let totalNilai = 0;
    let maxNilai = 0;

    const hasil = jawaban.map((j) => {
      const soal = soalMap[j.soalId];
      if (!soal) {
        return {
          soalId: j.soalId,
          jawabanUser: j.jawaban,
          isCorrect: false,
          error: "Soal tidak ditemukan",
        };
      }

      const isCorrect =
        soal.jawaban_benar &&
        j.jawaban &&
        soal.jawaban_benar.toLowerCase() === j.jawaban.toLowerCase();
      const bobot = soal.bobot_nilai || 1;

      maxNilai += bobot;
      if (isCorrect) {
        totalBenar++;
        totalNilai += bobot;
      } else {
        totalSalah++;
      }

      return {
        soalId: j.soalId,
        jawabanUser: j.jawaban,
        jawabanBenar: soal.jawaban_benar,
        isCorrect,
        bobot,
        pembahasan: soal.pembahasan,
      };
    });

    const skorAkhir =
      maxNilai > 0 ? Math.round((totalNilai / maxNilai) * 100) : 0;

    res.json({
      success: true,
      data: {
        latihan: {
          id: subBab.id,
          title: subBab.title,
          slug: slug,
        },
        hasil: hasil,
        summary: {
          totalSoal: jawaban.length,
          totalBenar,
          totalSalah,
          totalTidakDijawab: jawaban.length - totalBenar - totalSalah,
          skorAkhir,
          nilaiMaksimal: maxNilai,
          nilaiDiperoleh: totalNilai,
        },
      },
    });
  } catch (error) {
    console.error("Error submitting jawaban:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menyimpan jawaban",
      error: error.message,
    });
  }
});

// ============================================
// GET /api/latihan/mapel/:mapelSlug - Get all latihan by mapel
// ============================================
router.get("/mapel/:mapelSlug", async (req, res) => {
  try {
    const { mapelSlug } = req.params;

    // Get mapel
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

    // Get all sub_bab with soal count
    const latihanResult = await db.query(
      `SELECT 
        sbm.id,
        sbm.nama_sub_bab as title,
        sbm.kode_sub_bab as slug,
        sbm.deskripsi,
        sbm.bab_utama,
        sbm.foto,
        (SELECT COUNT(*) FROM soal WHERE id_sub_bab = sbm.id) as total_soal,
        (SELECT SUM(COALESCE(waktu_pengerjaan, 2)) FROM soal WHERE id_sub_bab = sbm.id) as total_waktu
       FROM sub_bab_mapel sbm
       WHERE sbm.id_mapel = $1
       ORDER BY sbm.bab_utama, sbm.urutan ASC`,
      [mapel.id]
    );

    // Group by bab_utama
    const groupedLatihan = {};
    latihanResult.rows.forEach((row) => {
      const bab = row.bab_utama || "Lainnya";
      if (!groupedLatihan[bab]) {
        groupedLatihan[bab] = [];
      }
      groupedLatihan[bab].push({
        id: row.id,
        title: row.title,
        slug: row.slug,
        deskripsi: row.deskripsi,
        foto: row.foto,
        totalSoal: parseInt(row.total_soal || 0),
        waktu: parseInt(row.total_waktu || 0),
      });
    });

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
        latihan: groupedLatihan,
        totalLatihan: latihanResult.rows.length,
      },
    });
  } catch (error) {
    console.error("Error fetching latihan by mapel:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat latihan",
      error: error.message,
    });
  }
});

// Helper function to determine difficulty from bobot_nilai
function getDifficultyFromBobot(bobot) {
  if (!bobot || bobot <= 1) return "Mudah";
  if (bobot <= 2) return "Sedang";
  return "Sulit";
}

module.exports = router;
