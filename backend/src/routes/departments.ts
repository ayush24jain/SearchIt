
import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/departments
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        abbreviation
      FROM departments
      ORDER BY name ASC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
});

export default router;
