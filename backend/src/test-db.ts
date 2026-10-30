
import pool from "./db.js";

async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT current_database() AS database");

    console.log("Database connection successful!");
    console.log("Connected database:", result.rows[0].database);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testDatabaseConnection();
