const router = require("express").Router();
const db = require("./db");

// Helper to format date like "03 September 2025"
const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// GET /api/tryout/:category (e.g., /api/tryout/tka or /api/tryout/utbk)
router.get("/:categorySlug", async (req, res) => {
  try {
    const { categorySlug } = req.params;

    // 1. Get Category ID
    const catResult = await db.query(
      "SELECT id FROM tryout_categories WHERE slug = $1",
      [categorySlug]
    );

    if (catResult.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    const categoryId = catResult.rows[0].id;

    // 2. Get Packages (Sections)
    const packagesResult = await db.query(
      "SELECT id, title FROM tryout_packages WHERE category_id = $1 ORDER BY id ASC",
      [categoryId]
    );

    // 3. Construct the response structure (Section -> Cards)
    const responseData = {};
    const currentTime = new Date();

    // Loop through packages to find their tryouts
    for (let i = 0; i < packagesResult.rows.length; i++) {
      const pkg = packagesResult.rows[i];
      const sectionKey = `section${i + 1}`; // Creates section1, section2, etc.

      const tryoutsResult = await db.query(
        `SELECT id, title, image_path, start_time, end_time, is_premium 
         FROM tryouts 
         WHERE package_id = $1 
         ORDER BY id ASC`,
        [pkg.id]
      );

      // Map DB rows to Frontend Card structure
      const cards = tryoutsResult.rows.map((row) => {
        const startDate = new Date(row.start_time);
        const endDate = new Date(row.end_time);

        // Logic for isOpen
        const isOpen = currentTime >= startDate && currentTime <= endDate;

        // Clean image path (remove ../.. if exists to make it absolute for public folder)
        const cleanImage = row.image_path.replace("../../", "/");

        return {
          id: row.id,
          title: row.title,
          image: cleanImage,
          alt: row.title,
          activeDate: `${formatDate(row.start_time)} - ${formatDate(
            row.end_time
          )}`,
          isPremium: row.is_premium,
          isOpen: isOpen,
        };
      });

      responseData[sectionKey] = {
        title: pkg.title,
        cards: cards,
      };
    }

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
