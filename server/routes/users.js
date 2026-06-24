require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const authMiddleware = require("../middlewares/auth");

const JWT_SECRET = process.env.JWT_SECRET;

// validation helpers
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // input validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }

  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
    return res.status(400).json({ error: "Username must be between 3 and 50 characters" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `insert into users (username, email, password_hash) values ($1, $2, $3) returning user_id`,
      [trimmedUsername, email.toLowerCase().trim(), hashedPassword],
    );
    res.status(201).json({
      user: { id: result.rows[0].user_id, username: trimmedUsername, email: email.toLowerCase().trim() },
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username or email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // input validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await db.query(
      `select user_id, username, password_hash from users where email = $1`,
      [email.toLowerCase().trim()],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.json({
      message: "Login successful",
      token: token,
      user: { id: user.user_id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `select user_id, username, email, created_at from users where user_id = $1`,
      [req.user.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;