import type { NewProduct, UpdatedProduct } from "../types/products";

const API_URL = "http://localhost:5000/products";

export async function getProducts(category?: string) {
  let url = API_URL;
  if (category) {
    url += `?category=${category}`;
  }

  const res = await fetch(url);

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
    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function updateProduct(
    id: number,
    product: UpdatedProduct
) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (!res.ok) {
        throw new Error("Failed to update product");
    }

    return res.json();
}


export async function deleteProduct(id:number){
    const res= await fetch(`${API_URL}/${id}`,{
        method:"DELETE",
    })

    if(!res.ok){
        throw new Error("Failed to delete product")
    }

    return res.json()

}
