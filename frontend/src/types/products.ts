export interface Product {
  product_id: number;
  product_name: string;
  category_id: number;
  category_name: string;
  price: number;
  quantity: number;
  discounted_price: number;
}

export interface NewProduct {
  product_name: string;
  category_id: number;
  price: number;
  quantity: number;
}

export interface UpdatedProduct {
  product_name?: string;
  category_id?: number;
  price?: number;
  quantity?: number;
}

export interface Meta {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface IRequestParams  {
    category?: string | null
    search?: string | null,
    lowStock?: boolean,
    page?: number,
    limit?: number,
   }