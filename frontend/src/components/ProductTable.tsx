import type { Product } from "../types/products";

interface ProductTableProps {
    products: Product[];
}

const ProductTable = ({ products }: ProductTableProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 color:bg-red-500">
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Category</th>
                        <th className="border px-4 py-2">Price</th>
                        <th className="border px-4 py-2">Quantity</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.product_id}>
                            <td className="border px-4 py-2">
                                {product.product_name}
                            </td>

                            <td className="border px-4 py-2">
                                {product.category}
                            </td>

                            <td className="border px-4 py-2">
                                Rs. {product.price}
                            </td>

                            <td className="border px-4 py-2">
                                {product.quantity}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;