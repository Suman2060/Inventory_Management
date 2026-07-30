import type { NewProduct, UpdatedProduct } from "../types/products";
import createApi from "../utils/axios";

const  productApi = createApi("/products")

export async function getProducts(category?: string, search?: string, lowStock?: boolean) {
    const {data} = await productApi.get("/", {
        params: {
            category, search, lowStock
        } 
    })
    return  data
}

export async function addProduct(product: NewProduct) {
    const {data} = await productApi.post("/",product);
    return data;
}

export async function updateProduct(id: number,product: UpdatedProduct) {
    const {data} = await productApi.put(`/${id}`, product);
    return data;
}

export async function deleteProduct(id: number) {
    const {data} = await productApi.delete(`/${id}`)
    return data
}
