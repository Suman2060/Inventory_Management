import {
  getProductService,
  createProductService,
  deleteProductService,
  updateProductService,
} from "../service/productService.js";

// GET products
export async function getProduct(req, res) {
  const { category, search, lowStock, page, limit } = req.query;

  const pageNumber =
    page === undefined || page === "" ? 1 : Number(page);

  const limitSize =
    limit === undefined || limit === "" ? 10 : Number(limit);

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

  try {
    const result = await getProductService({
      category,
      search,
      lowStock,
      pageNumber,
      limitSize,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching products:", err.message);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// CREATE product
export async function createProduct(req, res) {
  const {
    product_name,
    category_id,
    price,
    quantity,
  } = req.body;

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

  try {
    const result = await createProductService({
      product_name,
      category_id,
      price,
      quantity,
    });

    return res.status(201).json({
      message: "Product added successfully",
      product: result,
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

    if (err.message === "Selected category does not exist") {
      return res.status(400).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message: "Server Error",
    });
  }
}

// UPDATE product
export async function updateProduct(req, res) {
  const { id } = req.params;

  const {
    product_name,
    category_id,
    price,
    quantity,
  } = req.body;

  console.log("UPDATE ID:", id);
  console.log("UPDATE BODY:", req.body);

  try {
    const result = await updateProductService(id, {
      product_name,
      category_id,
      price,
      quantity,
    });

    console.log("UPDATED PRODUCT:", result);

    return res.status(200).json({
      message: "Product updated successfully",
      product: result,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);

    if (err.message === "No fields to update") {
      return res.status(400).json({ message: err.message });
    }

    if (err.message === "Expected a number") {
      return res.status(400).json({ message: err.message });
    }

    if (err.message === "Selected category does not exist") {
      return res.status(400).json({ message: err.message });
    }

    if (err.message === "Product already exists") {
      return res.status(409).json({ message: err.message });
    }

    if (err.message === "Product not found") {
      return res.status(404).json({ message: err.message });
    }

    return res.status(500).json({
      message: "Server Error",
    });
  }
}

// DELETE product
export async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const result = await deleteProductService(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting product:", err.message);

    return res.status(500).json({
      message: "Server Error",
    });
  }
}