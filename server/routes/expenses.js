const router = require("express").Router();
const conn = require("../config/db");

// create expense
router.post("/", async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    const newExpense = await conn.query(
      "INSERT INTO expenses (user_id, description, amount, category) VALUES ($1, $2, $3, $4) RETURNING *",
      [1, description, amount, category],
    );
    res.json(newExpense.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await conn.query(
      "SELECT * FROM expenses ORDER BY expense_date DESC",
    );
    res.json(expenses.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
