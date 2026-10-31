import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import CartItem from "../components/cart/CartItem";
import { formatPrice } from "../utils/helpers";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CheckoutModal from "../components/checkout/CheckoutModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function Cart() {
  const { cart, loading, totalPrice } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (loading) return <LoadingSpinner message="Loading cart..." />;

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const shipping = totalPrice > 0 && totalPrice < 50 ? 5 : 0;
  const tax = totalPrice * 0.05;
  const grandTotal = totalPrice + shipping + tax;

  // ---------- EMPTY STATE ----------
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-10"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Looks like you haven't added anything yet. Let's change that.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm hover:shadow-md"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ---------- CART WITH ITEMS ----------
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ---------- LEFT: ITEMS ---------- */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Continue shopping
                </Link>
              </div>
            </div>

            {/* ---------- RIGHT: ORDER SUMMARY ---------- */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {shipping === 0 ? (
                          <span className="text-green-600 dark:text-green-400">
                            Free
                          </span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Estimated tax</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(tax)}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3 flex justify-between items-baseline">
                      <span className="text-base font-semibold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Opens the checkout modal instead of navigating */}
                  <button
                    onClick={() => setCheckoutOpen(true)}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 rounded-xl font-semibold transition shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
                    Secure checkout powered by ABA PayWay
                  </p>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
                    <Truck className="w-5 h-5 mx-auto mb-1.5 text-blue-600 dark:text-blue-400" />
                    <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                      Fast Delivery
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
                    <ShieldCheck className="w-5 h-5 mx-auto mb-1.5 text-blue-600 dark:text-blue-400" />
                    <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                      Secure Payment
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
                    <RotateCcw className="w-5 h-5 mx-auto mb-1.5 text-blue-600 dark:text-blue-400" />
                    <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                      14-Day Returns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout modal — full-screen overlay */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
