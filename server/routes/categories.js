const router = require("express").Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

// get all categories
router.get("/", async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await db.query(
      `select * from categories where user_id = $1 order by type, name;`,
      [userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// create a new category
router.post("/", async (req, res) => {
  const { name, type } = req.body;
  const userId = req.user.userId;

  if (!name || !type) {
    return res.status(400).json({ error: "Name and type are required" });
  }

  try {
    const result = await db.query(
      `insert into categories (name, type, user_id) values ($1, $2, $3) returning *`,
      [name, type, userId],
    );
    res.status(201).json({ category: result.rows[0] });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Category already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const categoryId = req.params.id;
  const userId = req.user.userId;

  try {
    const result = await db.query(
      `delete from categories where category_id = $1 and user_id = $2 returning *;`,
      [categoryId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;