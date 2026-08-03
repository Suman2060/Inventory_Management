import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/products";
import type { Product,Meta } from "../types/products";
import ProductTable from "../components/ProductTable";
import Header from "../components/Header";
import ProductModal from "../components/ProductModal";
import useDebounce from "../hooks/useDebounce";
import { enqueueSnackbar,  } from "notistack";
import Pagination from "../components/Pagination";

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [search,setSearch] =  useState("")
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lowStock,setLowStock] =  useState(false)
  const [page,setPage] =  useState(1);
  const [limit,setLimit] = useState(10)
  const [meta,setMeta] = useState<Meta | null>(null)

const debounceSearch =  useDebounce(search,500)

  useEffect(() => {
    loadProducts(category,debounceSearch,lowStock,page,limit);
  }, [category,debounceSearch,lowStock,page,limit]);

  async function loadProducts(category: string,search: string,lowStock:boolean,page:number,limit:number) {
    try {
      setLoading(true);

      const response = await getProducts(category,search,lowStock,page,limit);
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
    loadProducts(category,search,lowStock,page,limit);
    handleModalClose();
  }

  async function handleDeleteProduct(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      loadProducts(category,search,lowStock,page,limit);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

   
     <button
  onClick={() =>
    enqueueSnackbar("Toast is working!", {
      variant: "success",
    })
  }
>
  Test Toast
</button>
      <Header
        onAddProduct={handleAddProduct}
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        lowStock= {lowStock}
        setLowStock ={setLowStock}
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
      page={page}
      setPage = {setPage}
      limit = {limit}
      setLimit={setLimit}
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
