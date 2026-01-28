const router = require("express").Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.post("/", async (req, res) => {
  const { amount, description, type, date, category_id } = req.body;
  const userId = req.user.userId;

  if (!amount || !type) {
    return res.status(400).json({ error: "Amount and type are required" });
  }

  try {
    const result = await db.query(
      `insert into transactions (amount, description, date, user_id, category_id) values ($1, $2, $3, $4, $5) returning *`,
      [amount, description, date || new Date(), userId, category_id || null],
    );
    res.status(201).json({ transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await db.query(
      `select t.*, c.name as category_name, c.type as category_type from transactions t left join categories c on t.category_id = c.category_id where t.user_id = $1 order by t.date desc`,
      [userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
