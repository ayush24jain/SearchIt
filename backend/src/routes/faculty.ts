
import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/faculty
// Optional query parameters: search, department
router.get("/", async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const department =
      typeof req.query.department === "string"
        ? req.query.department.trim()
        : "";

    const conditions: string[] = [];
    const values: string[] = [];

    // Search across all faculty information.
    if (search) {
      values.push(`%${search}%`);
      const searchIndex = values.length;

      conditions.push(`
        (
          f.full_name ILIKE $${searchIndex}
          OR f.designation ILIKE $${searchIndex}
          OR f.administrative_position ILIKE $${searchIndex}
          OR f.email ILIKE $${searchIndex}
          OR f.office_phone ILIKE $${searchIndex}
          OR f.office_room ILIKE $${searchIndex}
          OR d.name ILIKE $${searchIndex}
          OR d.abbreviation ILIKE $${searchIndex}
        )
      `);
    }

    // Optional department-specific filtering.
    if (department) {
      values.push(department);
      const departmentIndex = values.length;

      conditions.push(`
        (
          d.name ILIKE $${departmentIndex}
          OR d.abbreviation ILIKE $${departmentIndex}
        )
      `);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const result = await pool.query(
      `
        SELECT
          f.id,
          f.full_name,
          f.designation,
          f.email,
          f.office_phone,
          f.office_room,
          f.administrative_position,
          f.source_url,
          f.last_verified_at,
          f.photo_url,
          d.id AS department_id,
          d.name AS department_name,
          d.abbreviation AS department_abbreviation
        FROM faculty AS f
        LEFT JOIN departments AS d
          ON f.department_id = d.id
        ${whereClause}
        ORDER BY f.full_name ASC
      `,
      values
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching faculty:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch faculty",
    });
  }
});

// GET /api/faculty/:id
// Fetch one faculty member using their database ID.
router.get("/:id", async (req, res) => {
  try {
    const facultyId = req.params.id;

    // Validate the ID.
    if (!/^\d+$/.test(facultyId)) {
      res.status(400).json({
        success: false,
        message: "Invalid faculty ID",
      });
      return;
    }

    const result = await pool.query(
      `
        SELECT
          f.id,
          f.full_name,
          f.designation,
          f.email,
          f.office_phone,
          f.office_room,
          f.administrative_position,
          f.source_url,
          f.last_verified_at,
          f.photo_url,
          d.id AS department_id,
          d.name AS department_name,
          d.abbreviation AS department_abbreviation
        FROM faculty AS f
        LEFT JOIN departments AS d
          ON f.department_id = d.id
        WHERE f.id = $1
      `,
      [facultyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching faculty by ID:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch faculty member",
    });
  }
});

export default router;
