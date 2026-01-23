const { Client } = require("pg");

const conn = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "postgre@2026",
  database: "testdb",
});

conn
  .connect()
  .then(() => {
    console.log("Connected to the database successfully.");
  })
  .catch((err) => {
    console.error("Database connection error:", err.stack);
  });
