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

export interface UpdatedProduct {
  product_name?: string;
  category?: string;
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