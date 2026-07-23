import type { Product,NewProduct } from "../types/products";

const API_URL = "http://localhost:5000/products";

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(API_URL);
    console.log(res)

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    return res.json();
}

export async function addProduct(product: NewProduct) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (!res.ok) {
        throw new Error("Failed to add product");
    }

    return res.json();
}