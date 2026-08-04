import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/products";
import type { Product,Meta, IRequestParams } from "../types/products";
import ProductTable from "../components/ProductTable";
import Header from "../components/Header";
import ProductModal from "../components/ProductModal";
import useDebounce from "../hooks/useDebounce";

import Pagination from "../components/Pagination";

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [meta,setMeta] = useState<Meta | null>(null)

  const [requestParams,setRequestParams] = useState<IRequestParams>({
    category:   null,
    search:  null,
    lowStock: false,
    page: 1,
    limit:10
  })

const debounceSearch =  useDebounce(requestParams.search ?? "",500)
const debouncedRequestParams = {
  ...requestParams,
  search: debounceSearch
}

useEffect(() => {
  loadProducts();
}, [
  requestParams.category,
  requestParams.lowStock,
  requestParams.page,
  requestParams.limit,
  debounceSearch,
]);

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await getProducts(debouncedRequestParams);
      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  function handleModalClose() {
    setIsOpen(false);
    setSelectedProduct(null);
  }

  function handleAddProduct() {
    setSelectedProduct(null);
    setIsOpen(true);
  }

  function handleEditProduct(product: Product) {
    setSelectedProduct(product);
    setIsOpen(true);
  }

  function handleProductSuccess() {
    loadProducts();
    handleModalClose();
  }

  async function handleDeleteProduct(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      loadProducts();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header
        onAddProduct={handleAddProduct}
        requestParams =  {requestParams}
        setRequestParams = {setRequestParams}
      />

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ProductTable
          products={products}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      <Pagination
      requestParams={requestParams}
      setRequestParams={setRequestParams}
     totalPages={meta?.totalPages??1}
      />

      <ProductModal
        isOpen={isOpen}
        onClose={handleModalClose}
        selectedProduct={selectedProduct}
        onProductAdded={handleProductSuccess}
      />
    </div>
  );
}

export default Dashboard;
