

const FilterBar = () => {
  return (
    <div className="flex items-center gap-3">
      <select className="px-4 py-2 border border-gray-300 rounded-lg">
        <option>All Categories</option>
        <option>Electronics</option>
        <option>Accessories</option>
      </select>

      <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
        Low Stock
      </button>
    </div>
  );
};

export default FilterBar;
