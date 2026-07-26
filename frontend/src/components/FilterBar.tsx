interface FilterBarProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const FilterBar = ({
  category,
  setCategory,
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
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
      >
        Low Stock
      </button>

    </div>
  );
};

export default FilterBar;