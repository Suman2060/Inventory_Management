  import SearchBar from "./SearchBar";
  import FilterBar from "./FilterBar";
  import type { IRequestParams } from "../types/products";

  interface HeaderProps {
    onAddProduct: () => void;
    requestParams:IRequestParams,
    setRequestParams: React.Dispatch<
    React.SetStateAction<IRequestParams>
  >;

  }

  const Header = ({
    onAddProduct,
    requestParams,
    setRequestParams
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
          requestParams = {requestParams}
          setRequestParams = {setRequestParams}

        />

        <FilterBar
           requestParams = {requestParams}
          setRequestParams = {setRequestParams}

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