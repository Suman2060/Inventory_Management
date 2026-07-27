interface FilterBarProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  lowStock: boolean;
  setLowStock: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterBar = ({
  category,
  setCategory,
  lowStock,
  setLowStock
}: FilterBarProps) => {

  return (
    <div className="flex items-center gap-3">

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
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

      </select>

      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          lowStock
            ? "bg-yellow-600 text-white ring-2 ring-yellow-400 font-semibold"
            : "bg-yellow-500 text-white hover:bg-yellow-600"
        }`}
        onClick={() => {
          setLowStock((prev) => !prev);
        }}
      >
        Low Stock {lowStock ? "(Active)" : ""}
      </button>

    </div>
  );
};

export default FilterBar;