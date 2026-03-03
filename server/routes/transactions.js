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

router.put("/:id", async (req, res) => {
  const {id} = req.params;
  const {amount, description, category_id, date} = req.body;
  const userId = req.user.userId;

  try{
    const result = await db.query(
      `update transactions set amount = $1, description = $2, category_id=$3, date=$4 where transaction_id=$5 and user_id=$6 returning *`,
      [amount, description, category_id, date, id, userId]
    );

    if(result.rows.length === 0) {
      return res.status(404).json({error: "Transaction not found or unauthorized."});
    }

    res.json(result.rows[0]);
  }catch(err){
    console.log(err);
    res.status(500).json({error: "server error"});
  }
})

router.delete("/:id", async (req, res) => {
  try{
    const {id} = req.params;
    const userId = req.user.userId;

    const result = await db.query(
      `delete from transactions where transaction_id = $1 and user_id = $2 returning *`,
      [id, userId]
    );

    if(result.rowCount === 0){
      return res.status(404).json({error: "Transaction not found"});
    }

    res.json({message: "Transaction deleted successfully"});
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
