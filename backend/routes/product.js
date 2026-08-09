import { Router } from "express";
import pool from "../db/db.js";
import { isNumber, isUnique } from "..//validation/productValidation.js";

const router = Router();

// GET all products
router.get("/", async (req, res) => {
  const { category, search, lowStock, page, limit } = req.query;

  const pageNumber = page === undefined || page === "" ? 1 : Number(page);
  const limitSize = limit === undefined || limit === "" ? 10 : Number(limit);

  if (Number.isNaN(pageNumber) || Number.isNaN(limitSize)) {
    return res.status(400).json({
      message: "Provide valid page and limit numbers.",
    });
  }

  if (pageNumber < 1 || limitSize < 1) {
    return res.status(400).json({
      message: "Page and limit must be greater than or equal to 1.",
    });
  }

  if (limitSize > 50) {
    return res.status(400).json({
      message: "Limit cannot be greater than 50.",
    });
  }

  const offSet = (pageNumber - 1) * limitSize;

  let query = `
    SELECT p.*, c.category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
  `;
  let queryCount = "SELECT COUNT(*) FROM products p";

  try {
    const conditions = [];
    const values = [];

    // Category filter (category_id from the categories table)
    if (category) {
      conditions.push(`p.category_id = $${values.length + 1}`);
      values.push(Number(category));
    }

    // Search filter
    if (search) {
      conditions.push(`p.product_name ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
    }

    // Low stock filter
    if (lowStock === "true") {
      conditions.push(`p.quantity < $${values.length + 1}`);
      values.push(10);
    }

    // WHERE clause
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
      queryCount += ` LEFT JOIN categories c ON p.category_id = c.category_id WHERE ${conditions.join(" AND ")}`;
    }

    // Copy filter values for COUNT query
    const countValues = [...values];

    // Pagination query
    query += ` ORDER BY p.product_id ASC`;

    query += ` LIMIT $${values.length + 1}`;
    values.push(limitSize);

    query += ` OFFSET $${values.length + 1}`;
    values.push(offSet);

    console.log("Query:", query);
    console.log("Count Query:", queryCount);
    console.log("Values:", values);

    // Execute queries
    const result = await pool.query(query, values);
    const countResult = await pool.query(queryCount, countValues);

    // Metadata
    const totalRecords = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limitSize);

    return res.status(200).json({
      data: result.rows,
      meta: {
        pageNumber,
        pageSize: limitSize,
        totalPages,
        totalRecords,
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);

    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      detail: err.detail,
    });
  }
});

// POST  product

router.post("/", async (req, res) => {
  const {
    product_name,
    category_id,
    price,
    quantity,
  } = req.body;

  try {
    // Required fields
    if (
      !product_name ||
      category_id === undefined ||
      category_id === null ||
      category_id === ""
    ) {
      return res.status(400).json({
        message: "product_name and category_id are required",
      });
    }

    // Validate numbers
    await isNumber(category_id);
    await isNumber(price);
    await isNumber(quantity);

    // Check category exists
    const categoryResult = await pool.query(
      `
      SELECT category_id
      FROM categories
      WHERE category_id = $1
      `,
      [category_id],
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        message: "Selected category does not exist",
      });
    }

    // Check duplicate product
    await isUnique(product_name);

    // Insert product
    const result = await pool.query(
      `
      INSERT INTO products
        (product_name, category_id, price, quantity)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *;
      `,
      [
        product_name.trim(),
        Number(category_id),
        Number(price),
        Number(quantity),
      ],
    );

    return res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });

  } catch (err) {
    console.error("Error adding product:", err.message);

    if (err.message === "Expected a number") {
      return res.status(400).json({
        message: err.message,
      });
    }

    if (err.message === "Product already exists") {
      return res.status(409).json({
        message: err.message,
      });
    }

    // PostgreSQL foreign-key violation
    if (err.code === "23503") {
      return res.status(400).json({
        message: "Selected category does not exist",
      });
    }

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
      detail: err.detail,
    });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { product_name,  category_id, price, quantity } = req.body;
console.log("PUT category_id:", category_id);

  if(category_id !== undefined){
  const categoryResult = await pool.query(
    `
    SELECT category_id
    FROM categories
    WHERE category_id = $1
    `,
    [category_id],
  );

  if(categoryResult.rows.length === 0){
      return res.status(400).json({
      message: "Selected category does not exist",
    });

  }
  }


  const fields = [];
  const values = [];

  // Product name
  if (product_name !== undefined) {
    fields.push(`product_name = $${values.length + 1}`);
    values.push(product_name);
  }

  // Category
  if (category_id !== undefined) {
    fields.push(`category_id = $${values.length + 1}`);
    values.push(categoryValue);
  }

  // Price
  if (price !== undefined) {
    fields.push(`price = $${values.length + 1}`);
    values.push(price);
  }

  // Quantity
  if (quantity !== undefined) {
    fields.push(`quantity = $${values.length + 1}`);
    values.push(quantity);
  }

  // Nothing to update
  if (fields.length === 0) {
    return res.status(400).json({
      message: "No fields to update",
    });
  }

  values.push(id);

  try {
    const result = await pool.query(
      `
            UPDATE products
            SET ${fields.join(", ")}
            WHERE product_id = $${values.length}
            RETURNING *;
            `,
      values,
    );
    if (result.rows.length === 0) {
      return res.status(404).json("Product Not found");
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
      detail: err.detail,
    });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
            DELETE FROM products
            WHERE product_id = $1
            RETURNING *;
            `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;
