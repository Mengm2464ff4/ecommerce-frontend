import { useState, useEffect } from "react";
import { Search, DollarSign, RotateCcw, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function ProductSearch({ onSearch }) {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
  });

  // Sync when URL changes (back button, category click, etc.)
  useEffect(() => {
    setFilters({
      name: searchParams.get("search") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    });
  }, [searchParams]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      name: filters.name || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setFilters({ name: "", minPrice: "", maxPrice: "" });
    onSearch({ name: undefined, minPrice: undefined, maxPrice: undefined });
  };

  const hasFilters = filters.name || filters.minPrice || filters.maxPrice;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6 transition-colors"
    >
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search by name */}
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="name"
              value={filters.name}
              onChange={handleChange}
              placeholder="Product name..."
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {filters.name && (
              <button
                type="button"
                onClick={() => setFilters({ ...filters, name: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Min price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Min Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              name="minPrice"
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="0"
              className="w-28 pl-8 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Max price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Max Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              name="maxPrice"
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="9999"
              className="w-28 pl-8 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm shadow-blue-500/30"
          >
            <Search className="w-4 h-4" />
            Search
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg font-medium transition"
              title="Reset filters"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
