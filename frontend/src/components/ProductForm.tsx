import { useState } from "react";
import { addProduct } from "../api/products";

interface ProductFormProps {
    onProductAdded: () => void;
}

const ProductForm = ({ onProductAdded }: ProductFormProps) => {

    const [formData, setFormData] = useState({
        product_name: "",
        category: "",
        price: "",
        quantity: "",
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        try {

            await addProduct({
                product_name: formData.product_name,
                category: formData.category,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
            });

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
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Save Product
            </button>

        </form>

    );
};

export default ProductForm;