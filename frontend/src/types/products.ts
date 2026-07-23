export interface Product {
  product_id: number;
  product_name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface NewProduct {
  product_name: string;
  category: string;
  price: number;
  quantity: number;
}   