import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import type { Product } from "../types/products";
import ProductTable from "../components/ProductTable";
import Header from "../components/Header";
import ProductModal from "../components/ProductModal";

function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

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

    return (
        <div className="max-w-6xl mx-auto p-6">

            <Header
                onAddProduct={() => setIsOpen(true)}
            />

            {loading && <p>Loading...</p>}

            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <ProductTable products={products} />
            )}

            <ProductModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onProductAdded={async () => {
                    await loadProducts();
                    setIsOpen(false);
                }}
            />

        </div>
    );
}

export default Dashboard;