import { useState } from "react";
import { addProduct, updateProduct } from "../api/products";
import type { Product } from "../types/products";
import { enqueueSnackbar } from "notistack";

interface ProductFormProps {
  onProductAdded: () => void;
  selectedProduct: Product | null;
}

const initialFormData = {
  product_name: "",
  category: "",
  price: "",
  quantity: "",
  discountType: "",
  discountValue: "",
};

const ProductForm = ({ onProductAdded, selectedProduct }: ProductFormProps) => {
  const [formData, setFormData] = useState(() =>
    selectedProduct
      ? {
          product_name: selectedProduct.product_name,
          category: selectedProduct.category,
          price: selectedProduct.price.toString(),
          quantity: selectedProduct.quantity.toString(),
          discountType: "",
          discountValue: "",
        }
      : initialFormData,
  );
  const [error, setError] = useState("");

  const isFormInvalid =
    !formData.product_name.trim() || !formData.category.trim();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function resetForm() {
    setFormData(initialFormData);
    setError("");
  }

  function validateDiscount() {
    const price = Number(formData.price);
    const discount = Number(formData.discountValue);

    if (formData.discountValue === "") {
      return true;
    }

    if (!formData.discountType) {
      setError("Discount Type is required.");

      enqueueSnackbar("Please select a discount type.", {
        variant: "error",
      });

      return false;
    }

    if (formData.discountType === "percentage") {
      if (discount < 0 || discount > 100) {
        setError("Discount percentage must be between 0 and 100.");

        enqueueSnackbar("Enter a valid discount percentage.", {
          variant: "error",
        });

        return false;
      }
    }

    if (formData.discountType === "fixed") {
      if (discount < 0 || discount > price) {
        setError("Fixed discount cannot exceed the product price.");

        enqueueSnackbar("Enter a valid fixed discount.", {
          variant: "error",
        });

        return false;
      }
    }

    return true;
  }

  function calculateFinalPrice() {
    const price = Number(formData.price);
    const discount = Number(formData.discountValue);

    if (formData.price === "") {
      return "";
    }

    if (!formData.discountType || formData.discountValue === "") {
      console.log("Enter Type or discount Value ");
      return formData.price;
    }

    if (formData.discountType === "percentage") {
      return String(price - (price * discount) / 100);
    }

    if (formData.discountType === "fixed") {
      return String(price - discount);
    }

    return formData.price;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!formData.product_name.trim()) {
      setError("Product Name is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!validateDiscount()) {
      return;
    }

    const productData = {
      product_name: formData.product_name.trim(),
      category: formData.category.trim(),
      price: Number(calculateFinalPrice()),
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

        {/* Discount Type */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Discount Type
          </label>

          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Discount Type</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Discount Value
          </label>

          <input
            type="number"
            name="discountValue"
            placeholder="Discount"
            value={formData.discountValue}
            onChange={handleChange}
            className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Final Price */}
        <div>
          <label className="mb-1 block text-sm font-medium">Final Price</label>

          <input
            type="text"
            value={calculateFinalPrice()}
            readOnly
            className="w-full rounded border bg-gray-100 p-2"
          />
        </div>

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
        )}

        <button
          type="submit"
          disabled={isFormInvalid}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selectedProduct ? "Update Product" : "Save Product"}
        </button>
      </form>
    </>
  );
};

export default ProductForm;
