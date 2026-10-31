import { useState } from "react";
import {
  Package,
  Search,
  CheckCircle2,
  Truck,
  Home,
  Clock,
} from "lucide-react";
import { orderApi } from "../api/order";
import { formatDate, formatPrice } from "../utils/helpers";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    if (!orderId.trim()) {
      setError("Please enter your order ID");
      return;
    }
    try {
      setLoading(true);
      const res = await orderApi.getOrderById(orderId.trim());
      setOrder(res.data.data || res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Order not found. Please check your ID.",
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: "PLACED", label: "Order Placed", icon: CheckCircle2 },
    { key: "PROCESSING", label: "Processing", icon: Package },
    { key: "SHIPPED", label: "Shipped", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: Home },
  ];

  const currentIndex = order
    ? steps.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5 mx-auto">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Track Your Order
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your order ID to see the latest status.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleTrack} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-1001 or 12"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition shadow-lg shadow-blue-500/30"
            >
              {loading ? "Tracking..." : "Track"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </form>

        {/* Result */}
        {order && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Order ID
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                #{order.id}
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 dark:bg-gray-800" />
              <div
                className="absolute top-5 left-5 h-1 bg-blue-600 transition-all duration-500"
                style={{
                  width: `calc(${Math.max(currentIndex, 0) / (steps.length - 1)} * (100% - 40px))`,
                }}
              />
              <div className="relative flex justify-between">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= currentIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
                          done
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs mt-2 text-center font-medium text-gray-600 dark:text-gray-400 max-w-[80px]">
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Order date
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatPrice(order.totalAmount || order.total)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Shipping to
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.shippingAddress || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <p className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {order.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
