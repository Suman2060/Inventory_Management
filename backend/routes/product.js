import { Router } from "express";
import pool from "../db/db.js";
import { isNumber, isUnique } from "..//validation/productValidation.js"

const router = Router();

// GET all products
router.get("/", async (req, res) => {
    const { category, search, lowStock } = req.query;

    let query = `SELECT * FROM products`;

    try {
        const conditions = [];
        const values = [];

        // Category filter
        if (category) {
            conditions.push(`category = $${values.length + 1}`);
            values.push(category);
        }

        if (search) {
            conditions.push(`product_name ILIKE $${values.length + 1}`);
            values.push(`%${search}%`);
        }

        if (lowStock === "true") {
            conditions.push(`quantity < $${values.length + 1}`);
            values.push(10); 
        }


        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }

        // Sort products
        query += ` ORDER BY product_id ASC`;

        console.log("Query:", query);
        console.log("Values:", values);

        const result = await pool.query(query, values);

        res.json(result.rows);

    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: "Server Error",
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