import { PackageX } from "lucide-react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import Pagination from "../common/Pagination";

export default function ProductList({
  products,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onRetry,
}) {
  if (loading) return <LoadingSpinner message="Loading products..." />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        <PackageX className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          No products found
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Try adjusting your search or filter
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
