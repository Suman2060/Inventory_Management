import type { Product } from "../types/products";

interface ProductTableProps {
    products: Product[];
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (id: number)=>void;
}

const ProductTable = ({ products, onEditProduct,onDeleteProduct }: ProductTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td className="border px-4 py-2">{product.product_name}</td>

              <td className="border px-4 py-2">{product.category}</td>

              <td className="border px-4 py-2">Rs. {product.price}</td>

              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onEditProduct(product)}
                  className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition duration-200"
                >
                  Edit
                </button>
                 <button
                  onClick={() => onDeleteProduct(product.product_id)}
                  className="px-3 m-2.5 py-1 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
