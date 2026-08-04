import type { IRequestParams } from "../types/products";

interface FilterBarProps {
  requestParams: IRequestParams;
  setRequestParams: React.Dispatch<
    React.SetStateAction<IRequestParams>
  >;
}
const FilterBar = ({
  requestParams,setRequestParams
}: FilterBarProps) => {

  return (
    <>
    <div className="flex items-center gap-3">

      <select
        value={requestParams.category ?? ""}
        onChange={(e) =>
          setRequestParams((prev)=>({
            ...prev,
            category: e.target.value,
            page: 1
          }))
          }
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="">
          All Categories
        </option>

        <option value="Electronics">
          Electronics
        </option>

        <option value="Accessories">
          Accessories
        </option>
        <option value="Drink">
          Drink
        </option>

      </select>

      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
         requestParams.lowStock
            ? "bg-yellow-600 text-white ring-2 ring-yellow-400 font-semibold"
            : "bg-yellow-500 text-white hover:bg-yellow-600"
        }`}
        onClick={() => {
          setRequestParams((prev) => ({
            ...prev,
            lowStock:!prev.lowStock,
            page:1
          }));
        }}
      >
        Low Stock {requestParams.lowStock ? "(Active)" : ""}
      </button>

    </div>
  </>
  );
};

export default FilterBar;