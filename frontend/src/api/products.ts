import axios from "axios";
import type { NewProduct, UpdatedProduct } from "../types/products";

const API_URL = "http://localhost:5000/products";

export async function getProducts(category?: string, search?: string, lowStock?: boolean) {
    const data = await axios.get(API_URL, {
        params: {
            category, search, lowStock
        }
    })
    return  data.data
}



export async function addProduct(product: NewProduct) {
    const res = await axios.post(API_URL,product);
    return res.data;
}



export async function updateProduct(id: number,product: UpdatedProduct) {
    const res = await axios.put(`${API_URL}/${id}`, product);
    return res.data;
}


export async function deleteProduct(id: number) {
    const res = await axios.delete(`${API_URL}/${id}`
    )

    return res.data

}
