import pool from "../db/db.js";
import {
  isNumber,
  isUnique,
} from "../validation/productValidation.js";

// GET products
export async function getProductService({
  category,
  search,
  lowStock,
  pageNumber,
  limitSize,
}) {
  const offset = (pageNumber - 1) * limitSize;

  let query = `
    SELECT p.*, c.category_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.category_id
  `;

  let queryCount = `
    SELECT COUNT(*)
    FROM products p
  `;

  const conditions = [];
  const values = [];

  // Category filter
  if (category) {
    conditions.push(
      `p.category_id = $${values.length + 1}`
    );

    values.push(Number(category));
  }

  // Search filter
  if (search) {
    conditions.push(
      `p.product_name ILIKE $${values.length + 1}`
    );

    values.push(`%${search}%`);
  }

  // Low-stock filter
  if (lowStock === "true") {
    conditions.push(
      `p.quantity < $${values.length + 1}`
    );

    values.push(10);
  }

  // WHERE
  if (conditions.length > 0) {
    const whereClause = `
      WHERE ${conditions.join(" AND ")}
    `;

    query += whereClause;
    queryCount += whereClause;
  }

  // Save values before pagination
  const countValues = [...values];

  // Pagination
  query += ` ORDER BY p.product_id ASC`;

  query += ` LIMIT $${values.length + 1}`;
  values.push(limitSize);

  query += ` OFFSET $${values.length + 1}`;
  values.push(offset);

  const result = await pool.query(query, values);

  const countResult = await pool.query(
    queryCount,
    countValues
  );

  const totalRecords = Number(
    countResult.rows[0].count
  );

  const totalPages = Math.ceil(
    totalRecords / limitSize
  );

  return {
    data: result.rows,
    meta: {
      pageNumber,
      pageSize: limitSize,
      totalPages,
      totalRecords,
    },
  };
}

// CREATE product
export async function createProductService(productData) {
  const {
    product_name,
    category_id,
    price,
    quantity,
  } = productData;

  await isNumber(category_id);
  await isNumber(price);
  await isNumber(quantity);

  // Check category
  const categoryResult = await pool.query(
    `
      SELECT category_id
      FROM categories
      WHERE category_id = $1
    `,
    [category_id]
  );

  if (categoryResult.rows.length === 0) {
    throw new Error(
      "Selected category does not exist"
    );
  }

  // Check duplicate product
  await isUnique(product_name);

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
    ]
  );

  return result.rows[0];
}

// UPDATE product
export async function updateProductService(
  id,
  productData
) {
  const {
    product_name,
    category_id,
    price,
    quantity,
  } = productData;

  const fields = [];
  const values = [];

  // Product name
  if (product_name !== undefined) {
    await isUnique(product_name, id);

    fields.push(
      `product_name = $${values.length + 1}`
    );

    values.push(product_name.trim());
  }

  // Category
  if (category_id !== undefined) {
    await isNumber(category_id);

    const categoryResult = await pool.query(
      `
        SELECT category_id
        FROM categories
        WHERE category_id = $1
      `,
      [category_id]
    );

    if (categoryResult.rows.length === 0) {
      throw new Error(
        "Selected category does not exist"
      );
    }

    fields.push(
      `category_id = $${values.length + 1}`
    );

    values.push(Number(category_id));
  }

  // Price
  if (price !== undefined) {
    await isNumber(price);

    fields.push(
      `price = $${values.length + 1}`
    );

    values.push(Number(price));
  }

  // Quantity
  if (quantity !== undefined) {
    await isNumber(quantity);

    fields.push(
      `quantity = $${values.length + 1}`
    );

    values.push(Number(quantity));
  }

  // Nothing to update
  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  // Product ID
  values.push(id);

  const result = await pool.query(
  `
  UPDATE products
  SET ${fields.join(", ")}
  WHERE product_id = $${values.length}
  RETURNING *;
  `,
  values
);

if (result.rows.length === 0) {
  throw new Error("Product not found");
}

return result.rows[0];
}

// DELETE product
export async function deleteProductService(id) {
  const result = await pool.query(
    `
      DELETE FROM products
      WHERE product_id = $1
      RETURNING *;
    `,
    [id]
  );

  return result;
}