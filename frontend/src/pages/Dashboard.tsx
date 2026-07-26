import { useEffect, useState } from "react";
import { getProducts,deleteProduct } from "../api/products";
import type { Product } from "../types/products";
import ProductTable from "../components/ProductTable";
import Header from "../components/Header";
import ProductModal from "../components/ProductModal";

function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal State
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            setLoading(true);

            const data = await getProducts();
            setProducts(data);

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

    async function handleDeleteProduct(id:number){

        const confirmDelete =  window.confirm(
            "Are you sure you want to delete this product? "
        );
        if (!confirmDelete) return ;
        try{
            await deleteProduct(id);
            loadProducts();
        }catch (err){
            console.error(err)
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6">

            <Header
                onAddProduct={handleAddProduct}
            />

            {loading && (
                <p>Loading...</p>
            )}

            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <ProductTable
                    products={products}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                    
                    />
            )}

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