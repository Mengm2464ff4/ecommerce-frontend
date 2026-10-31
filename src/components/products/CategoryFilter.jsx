import { LayoutGrid, Tag } from "lucide-react";

export default function CategoryFilter({ categories, selectedId, onChange }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Categories
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* All button */}
        <button
          onClick={() => onChange(null)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedId === null
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
              : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          All
        </button>

        {/* Category buttons */}
        {categories.map((cat) => {
          const active = selectedId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
