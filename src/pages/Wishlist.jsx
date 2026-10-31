import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import { useProductsCache } from "../hooks/useProductsCache";
import ProductCard from "../components/products/ProductCard";

export default function Wishlist() {
  const navigate = useNavigate();
  const { ids, count, clear } = useWishlist();
  const { products, loading } = useProductsCache();

  const saved = useMemo(
    () => products.filter((product) => ids.includes(product.id)),
    [products, ids],
  );

  const backButton = (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );

  if (count === 0) {
    return (
      <div className="min-h-[60vh] px-4 py-10">
        <div className="mx-auto max-w-2xl">
          {backButton}

          <div className="w-full rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 dark:bg-pink-500/10">
              <Heart className="h-10 w-10 text-pink-600 dark:text-pink-400" />
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Your wishlist is empty
            </h1>

            <p className="mb-8 text-gray-500 dark:text-gray-400">
              Tap the ❤️ on any product to save it here.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        {backButton}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
              My Wishlist
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {count} {count === 1 ? "item" : "items"} saved
            </p>
          </div>

          <button
            type="button"
            onClick={clear}
            className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
          >
            Clear all
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : saved.length === 0 ? (
          <p className="text-gray-500">Saved products could not be found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
