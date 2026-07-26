import { useEffect, useState } from "react";
import { addProduct, updateProduct } from "../api/products";
import type { Product } from "../types/products";

interface ProductFormProps {
    onProductAdded: () => void;
    selectedProduct: Product | null;
}

const ProductForm = ({
    onProductAdded,
    selectedProduct,
}: ProductFormProps) => {
    const [formData, setFormData] = useState({
        product_name: "",
        category: "",
        price: "",
        quantity: "",
    });

    useEffect(() => {
        if (!selectedProduct) {
            setFormData({
                product_name: "",
                category: "",
                price: "",
                quantity: "",
            });
            return;
        }

        setFormData({
            product_name: selectedProduct.product_name,
            category: selectedProduct.category,
            price: selectedProduct.price.toString(),
            quantity: selectedProduct.quantity.toString(),
        });
    }, [selectedProduct]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        const productData = {
                product_name: formData.product_name,
                category: formData.category,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
        };
        try {
            if (selectedProduct) {
                // UPDATE
                await updateProduct(
                    selectedProduct.product_id,
                    productData
                );
            } else {
                // CREATE
                await addProduct(productData);
            }

            onProductAdded();

            setFormData({
                product_name: "",
                category: "",
                price: "",
                quantity: "",
            });

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <input
                type="text"
                name="product_name"
                placeholder="Product Name"
                value={formData.product_name}
                onChange={handleChange}
                className="w-full border rounded p-2"
            />

            <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded p-2"
            />

            <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded p-2"
            />

            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border rounded p-2"
            />

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {selectedProduct ? "Update Product" : "Save Product"}
            </button>
        </form>
    );
};

export default ProductForm;