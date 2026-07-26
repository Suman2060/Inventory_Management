import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";

interface HeaderProps {
    onAddProduct: () => void;
}

const Header = ({
    onAddProduct,
}: HeaderProps) => {
    return (
        <header className="flex items-center justify-between mb-8">

            {/* Left Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Inventory Management
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage your products efficiently.
                </p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">

                <SearchBar />

                <FilterBar />

                <button
                    onClick={onAddProduct}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    Add Product
                </button>

            </div>

        </header>
    );
};

export default Header;