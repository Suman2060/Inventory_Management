import ProductForm from "./ProductForm";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: () => void;
}

const ProductModal = ({
    isOpen,
    onClose,
    onProductAdded,
}: ProductModalProps) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    Add Product
                </h2>

                <ProductForm
                    onProductAdded={onProductAdded}
                />

            </div>

        </div>
    );
};

export default ProductModal;