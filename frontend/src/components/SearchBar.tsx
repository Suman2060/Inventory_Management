import type { IRequestParams } from "../types/products";

interface SearchBarProps {
  requestParams: IRequestParams;
  setRequestParams: React.Dispatch<
    React.SetStateAction<IRequestParams>
  >;
}

const SearchBar = ({
  requestParams,
  setRequestParams,
}: SearchBarProps) => {
  return (
    <input
      type="text"
      placeholder="Search Products"
      value={requestParams.search ?? ""}
      onChange={(e) =>
        setRequestParams((prev) => ({
          ...prev,
          search: e.target.value,
          page: 1,
        }))
      }
      className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SearchBar;