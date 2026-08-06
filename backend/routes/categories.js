
import { Router } from "express";
import pool from "../db/db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//Create new Category
router.post("/", async (req, res) => {
  const { category_name } = req.body;

  if (!category_name || !category_name.trim()) {
    return res.status(400).json({
      message: "Category name is required",
    });
  }

  try {
    const result = await pool.query(
      `
  INSERT INTO categories(category_name)
  VALUES($1)
  RETURNING *;
  `,
      [category_name.trim()],
    );
    return res.status(201).json({
      message: "New Category Added",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({
        message: "Category already exists",
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
