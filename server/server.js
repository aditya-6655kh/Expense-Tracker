require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 3000;
const db = require("./config/db");

const startServer = async () => {
  try {
    await db.query("SELECT NOW()");
    console.log("Database connected successfully.");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  }
};

startServer();
