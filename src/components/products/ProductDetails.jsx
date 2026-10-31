import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  Tag,
  Truck,
  Shield,
  ArrowLeft,
  X,
  ZoomIn,
  Heart,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { formatPrice, getImageUrl } from "../../utils/helpers";
import { useWishlist } from "../../hooks/useWishlist"; // 👈 Import the hook

export default function ProductDetails({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggle, has } = useWishlist(); // 👈 Use the hook
  
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(false);

  const isWishlisted = has(product.id); // 👈 Check if it's saved

  // 👈 New Wishlist handler
  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggle(product.id); // This saves to localStorage AND the backend
  };

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      setMessage("");
      setError("");
      await addToCart(product.id, quantity);
      setMessage("Added to cart!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(product.stock, q + 1));

  const imgSrc = getImageUrl(product.imageUrl);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* IMAGE — clickable */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div
              onClick={() => setLightbox(true)}
              className="relative aspect-square bg-gray-50 dark:bg-gray-800 flex items-center justify-center cursor-zoom-in group"
            >
              {product.imageUrl ? (
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="w-full h-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <Package className="w-24 h-24 text-gray-300 dark:text-gray-600" />
              )}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                <Tag className="w-3 h-3" />
                {product.categoryName ||
                  product.category?.name ||
                  "Uncategorized"}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              {formatPrice(product.price)}
            </p>

            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-2">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  In stock — {product.stock} available
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-500/20">
                  <AlertCircle className="w-4 h-4" />
                  Out of stock
                </span>
              )}
            </div>

            {/* Quantity + Add */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                  <button
                    type="button"
                    onClick={decreaseQty}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition"
                  >
                    <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  <span className="w-14 text-center font-medium text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increaseQty}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition"
                  >
                    <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-blue-500/30"
                >
                  {adding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>

                {/* 👇 UPDATED WISHLIST BUTTON HERE 👇 */}
                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition border-2 ${
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {isWishlisted ? "Saved" : "Wishlist"}
                </button>
                {/* 👆 END OF WISHLIST BUTTON 👆 */}
              </div>
            )}

            {message && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-4 py-2.5 rounded-lg border border-green-200 dark:border-green-500/20 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                {message}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-500/20 mb-4">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Free Shipping
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    On orders over $50
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Secure Payment
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    100% protected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX — no size selector */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
          >
            <div className="bg-gray-100 dark:bg-gray-950 aspect-square">
              {product.imageUrl ? (
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-24 h-24 text-gray-300 dark:text-gray-600 m-auto" />
              )}
            </div>

            <div className="p-6 sm:p-8 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h2>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl h-11">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}