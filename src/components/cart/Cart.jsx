import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import CartItem from "./CartItem";
import { formatPrice } from "../../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";

export default function Cart() {
const { cart, loading, itemCount } = useCart();
const totalAmount = cart?.totalAmount || 0;
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner message="Loading cart..." />;
  }

  const items = cart?.items || [];

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <span className="text-gray-600">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between text-lg mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-lg mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(totalAmount)}</span>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/products"
            className="flex-1 text-center border-2 border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => navigate("/checkout")}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
