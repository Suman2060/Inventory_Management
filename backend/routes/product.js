import { Router } from "express";
import pool from "../db/db.js";
import { isNumber, isUnique } from "..//validation/productValidation.js"

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

  let query = "SELECT * FROM products";
  let queryCount = "SELECT COUNT(*) FROM products";

  try {
    const conditions = [];
    const values = [];

    // Category filter
    if (category) {
      conditions.push(`category = $${values.length + 1}`);
      values.push(category);
    }

    // Search filter
    if (search) {
      conditions.push(`product_name ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
    }

    // Low stock filter
    if (lowStock === "true") {
      conditions.push(`quantity < $${values.length + 1}`);
      values.push(10);
    }

    // WHERE clause
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
      queryCount += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Copy filter values for COUNT query
    const countValues = [...values];

    // Pagination query
    query += ` ORDER BY product_id ASC`;

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
    });
  }
});

// POST new product
router.post("/", async (req, res) => {
    const { product_name, category, price, quantity } = req.body;

    try {
    
        if (!product_name || !category) {
            return res.status(400).json({
                message: "product_name and category are required"
            });
        }

        await isNumber(price);
        await isNumber(quantity);
        await isUnique(product_name);

        const result = await pool.query(
            `
            INSERT INTO products
            (product_name, category, price, quantity)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
            [product_name, category, price, quantity]
        );

        res.status(201).json({
            message: "Product added successfully",
            product: result.rows[0]
        });

    } catch (err) {
        console.error("Error adding product:", err.message);

        if (err.message === "Expected a number") {
            return res.status(400).json({ message: err.message });
        }

        if (err.message === "Product already exists") {
            return res.status(409).json({ message: err.message });
        }

        res.status(500).json({
            message: "Server Error"
        });
    }
});

// PUT update product
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { product_name, category, price, quantity } = req.body;

  

    const fields = [];
    const values = [];

 
    // Product name
    if (product_name !== undefined) {
        fields.push(`product_name = $${values.length + 1}`);
        values.push(product_name);
    }

    // Category
    if (category !== undefined) {
        fields.push(`category = $${values.length + 1}`);
        values.push(category);
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
            values
        );
           if(result.rows === 0){
                return res.status(403).json("Product Not found");
            }

        res.status(200).json({
            message: "Product updated successfully",
            product: result.rows[0],
        });

    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: "Server Error",
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
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: "Server Error"
        });
    }
});

export default router;