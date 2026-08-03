import { enqueueSnackbar } from "notistack";
import type { NewProduct, UpdatedProduct } from "../types/products";
import createApi from "../utils/axios";

const  productApi = createApi("/products")

export async function getProducts(
    category?: string,
    search?: string,
    lowStock?: boolean,
    page?: number,
    limit?: number,
) {
    const {data} = await productApi.get("/", {
        params: {
            category,
            search,
            lowStock,
            page,
            limit,
        } 
    })
    console.log(data)
    return data
}

export async function addProduct(product: NewProduct) {
    const {data} = await productApi.post("/",product);
    enqueueSnackbar("Successfully added",{variant:"success"})
    return data;
}

export async function updateProduct(id: number,product: UpdatedProduct) {
    const {data} = await productApi.put(`/${id}`, product);
     enqueueSnackbar("Successfully Updated",{variant:"success"})
    return data;
}

export async function deleteProduct(id: number) {
    const {data} = await productApi.delete(`/${id}`)
     enqueueSnackbar("Successfully Deleted",{variant:"success"})
    return data
}
