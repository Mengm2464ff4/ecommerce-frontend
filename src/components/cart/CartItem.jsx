import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { formatPrice, getImageUrl } from "../../utils/helpers";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  const imageUrl = item.productImageUrl
    ? getImageUrl(item.productImageUrl)
    : null;

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      {/* Image */}
      <Link
        to={`/products/${item.productId}`}
        className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </Link>

      {/* Name + price + size */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-1"
        >
          {item.productName}
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {formatPrice(item.price)}
        </p>

        {/* 👇 SIZE BADGE */}
        {item.size && (
          <span className="inline-block mt-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            Size: {item.size}
          </span>
        )}
      </div>

      {/* Quantity controls — uses item.id */}
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            updateQuantity(item.id, Math.max(1, item.quantity - 1))
          }
          disabled={item.quantity <= 1}
          className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
          {item.quantity}
        </span>

        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-gray-900 dark:text-white">
          {formatPrice(item.subtotal)}
        </p>
      </div>

      {/* Remove — uses item.id */}
      <button
        onClick={() => removeItem(item.id)}
        className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
        title="Remove"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
