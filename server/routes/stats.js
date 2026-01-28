const router = require("express").Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/dashboard", async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      `select coalesce(sum(case when c.type = 'income' then t.amount else 0 end), 0) as total_income, 
            coalesce(sum(case when c.type = 'expense' then t.amount else 0 end), 0) as total_expense from transactions t join categories c on t.category_id = c.category_id where t.user_id = $1 and t.date >= date_trunc('month', current_date)`,
      [userId],
    );
    const data = result.rows[0];
    const income = parseFloat(data.total_income);
    const expense = parseFloat(data.total_expense);
    const balance = income - expense;

    res.json({
      income,
      expense,
      balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/chart", async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await db.query(
      `select c.name, sum(t.amount) as total from transactions t join categories c on t.category_id = c.category_id where t.user_id = $1 and c.type = 'expense' group by c.name order by total desc`,
      [userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
