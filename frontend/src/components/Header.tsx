import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";

interface HeaderProps {
  onAddProduct: () => void;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  search:string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  lowStock:boolean;
  setLowStock: React.Dispatch<React.SetStateAction<boolean>>;

}

const Header = ({
  onAddProduct,
  category,
  setCategory,
  search,
  setSearch,
  lowStock,
  setLowStock
}: HeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-8">

      <div>
        <h1 className="text-3xl font-bold">
          Inventory Management
        </h1>

        <p className="text-gray-500">
          Manage your products efficiently.
        </p>
      </div>

      <div className="flex items-center gap-4">

        <SearchBar
        search = {search}
        setSearch = {setSearch}
        />

        <FilterBar
          category={category}
          setCategory={setCategory}
          lowStock = {lowStock}
          setLowStock={setLowStock}
        />

        <button
          onClick={onAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>

      </div>

    </header>
  );
};

export default Header;