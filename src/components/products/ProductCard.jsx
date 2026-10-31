import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Star,
  Flame,
  TrendingUp,
  Heart,
  MessageCircle,
} from "lucide-react";
import { formatPrice, getImageUrl, truncate } from "../../utils/helpers";
import { useWishlist } from "../../hooks/useWishlist";

export default function ProductCard({ product }) {
  const outOfStock = product.stock === 0;
  const rating = Number(product.rating) || 0;
  const ratingCount = Number(product.ratingCount) || 0;

  const badge = product.badge || null;
  const discount = Number(product.discountPercent) || 0;
  const originalPrice =
    discount > 0
      ? Number((Number(product.price) / (1 - discount / 100)).toFixed(2))
      : 0;
  const hasDiscount = discount > 0;

  const { has, toggle } = useWishlist();
  const liked = has(product.id);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
        {product.imageUrl ? (
          <img
           // NEW
            src={`https://ecommerce-backend-j7c9.onrender.com${product.imageUrl}`}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/400x400/eef2ff/6c7bf5?text=No+Image";
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* Deal badge */}
        {badge && !outOfStock && (
          <span
            className={`absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-lg z-10 ${
              badge === "Flash Sale" || badge === "Hot Deal"
                ? "bg-red-500"
                : badge === "Best Seller"
                  ? "bg-amber-500"
                  : badge === "Trending"
                    ? "bg-orange-500"
                    : badge === "Limited"
                      ? "bg-purple-500"
                      : badge === "New Arrival"
                        ? "bg-emerald-500"
                        : "bg-gray-600"
            }`}
          >
            {badge === "Hot Deal" || badge === "Flash Sale" ? (
              <Flame className="w-3 h-3" />
            ) : badge === "Best Seller" ? (
              <Star className="w-3 h-3 fill-current" />
            ) : badge === "Trending" ? (
              <TrendingUp className="w-3 h-3" />
            ) : null}
            {badge}
          </span>
        )}

        {/* Discount badge */}
        {hasDiscount && !outOfStock && (
          <span className="absolute top-3 right-3 inline-flex items-center text-sm font-bold px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900 shadow-lg z-10">
            -{discount}%
          </span>
        )}

        {/* Wishlist heart */}
        <button
          onClick={handleLike}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:scale-110 active:scale-95 transition shadow-md z-20"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition ${
              liked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        {/* Out of stock */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
            <span className="text-white font-semibold text-sm px-4 py-2 rounded-full bg-red-500/90">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
          {truncate(product.description || "No description available", 70)}
        </p>

        {/* ============ RATING ROW (UPDATED) ============ */}
        {ratingCount >= 5 ? (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-current text-yellow-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              ({ratingCount})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 mb-2 text-xs text-gray-400">
            <MessageCircle className="w-3.5 h-3.5" />
            No reviews yet
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {!outOfStock && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-500/20">
              <ShoppingCart className="w-3 h-3" />
              {product.stock}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
