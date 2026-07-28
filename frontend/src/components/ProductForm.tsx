import { useEffect, useState } from "react";
import { addProduct, updateProduct } from "../api/products";
import type { Product } from "../types/products";

interface ProductFormProps {
  onProductAdded: () => void;
  selectedProduct: Product | null;
}

const initialFormData = {
  product_name: "",
  category: "",
  price: "",
  quantity: "",
};

const ProductForm = ({ onProductAdded, selectedProduct }: ProductFormProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedProduct) {
      setFormData(initialFormData);
      return;
    }

    setFormData({
      product_name: selectedProduct.product_name,
      category: selectedProduct.category,
      price: selectedProduct.price.toString(),
      quantity: selectedProduct.quantity.toString(),
    });
  }, [selectedProduct]);

  const isFormInvalid =
    !formData.product_name.trim() || !formData.category.trim();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function resetForm() {
    setFormData(initialFormData);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!formData.product_name.trim()) {
      setError("Product Name is required.");
    }
    if (!formData.category.trim()) {
      setError("Category is required");
    }

    const productData = {
      product_name: formData.product_name.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.product_id, productData);
      } else {
        await addProduct(productData);
      }

      resetForm();
      onProductAdded();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    }
  }

  return (
    <>
      {error && (
        <p className="mb-3 rounded-md border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
        />

        {isFormInvalid && (
        <p className="text-sm text-red-500">
          Enter Product Name and Category to enable submit.
        </p>
      ) }
        
          <button
            type="submit"
            disabled = {isFormInvalid}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed "
          >
            {selectedProduct ? "Update Product" : "Save Product"}
          </button>
    
      </form>
    </>
  );
};

export default ProductForm;
