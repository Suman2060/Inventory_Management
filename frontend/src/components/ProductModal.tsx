import ProductForm from "./ProductForm";
import type { Product } from "../types/products";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProduct: Product | null;
    onProductAdded: () => void;
}

const ProductModal = ({
    isOpen,
    onClose,
    selectedProduct,
    onProductAdded,
}: ProductModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-xl font-semibold">
                        {selectedProduct ? "Edit Product" : "Add Product"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 text-xl"
                    >
                        ✕
                    </button>

                </div>

                <ProductForm
                    key={selectedProduct?.product_id ?? "new"}
                    selectedProduct={selectedProduct}
                    onProductAdded={onProductAdded}
                />

            </div>

        </div>
    );
};

export default ProductModal;