import { useEffect, useState } from "react";
import { getCategories } from "../api/categories";
import type { Category } from "../types/category";
import type { IRequestParams } from "../types/products";

interface FilterBarProps {
  requestParams: IRequestParams;
  setRequestParams: React.Dispatch<
    React.SetStateAction<IRequestParams>
  >;
}

const FilterBar = ({ requestParams, setRequestParams }: FilterBarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }

    loadCategories();
  }, []);

  return (
    <>
      <div className="flex items-center gap-3">
        <select
          value={requestParams.category ?? ""}
          onChange={(e) =>
            setRequestParams((prev) => ({
              ...prev,
              category: e.target.value || null,
              page: 1,
            }))
          }
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat.category_id} value={String(cat.category_id)}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${requestParams.lowStock
              ? "bg-yellow-600 text-white ring-2 ring-yellow-400 font-semibold"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          onClick={() => {
            setRequestParams((prev) => ({
              ...prev,
              lowStock: !prev.lowStock,
              page: 1,
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