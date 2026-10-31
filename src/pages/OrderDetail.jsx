import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  ChevronLeft,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { orderApi } from "../api/order";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
    border: "border-yellow-200 dark:border-yellow-500/20",
    icon: Clock,
  },
  PROCESSING: {
    label: "Processing",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/20",
    icon: Loader2,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-purple-700 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-500/20",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    border: "border-green-200 dark:border-green-500/20",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-200 dark:border-red-500/20",
    icon: XCircle,
  },
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await orderApi.getOrderById(id);
      setOrder(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load order:", err);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancelling(true);
      await orderApi.cancelOrder(id);
      await fetchOrder();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-600" />
          <p>Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-300 dark:text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || "We couldn't find this order."}
          </p>
          <Link
            to="/orders"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = status.icon;
  const canCancel = ["PENDING", "PROCESSING"].includes(order.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back + Header */}
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Orders
        </button>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Order {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Placed on{" "}
              {order.placedAt
                ? new Date(order.placedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${status.bg} ${status.color} ${status.border}`}
          >
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT — items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Items ({order.items?.length || 0})
                </h2>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                      {item.productImageUrl ? (
                        <img
                          src={`http://localhost:8080${item.productImageUrl}`}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {item.productId ? (
                        <Link
                          to={`/products/${item.productId}`}
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                      ) : (
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {item.productName}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 dark:text-white">
                        $
                        {(Number(item.price) * Number(item.quantity)).toFixed(
                          2,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ${Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — info */}
          <div className="space-y-6">
            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Shipping Address
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {order.shippingAddress || "No address provided"}
              </p>
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Payment
                </h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Method
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {order.paymentMethod || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Status
                  </span>
                  <span
                    className={`font-medium ${
                      order.paymentStatus === "PAID"
                        ? "text-green-600 dark:text-green-400"
                        : order.paymentStatus === "FAILED"
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">
                    Total
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Cancel button */}
            {canCancel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full px-5 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  You can cancel while the order is pending or processing
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
