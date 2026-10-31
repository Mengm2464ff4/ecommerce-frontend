import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderApi } from "../../api/order";
import { formatPrice, formatDateTime, getImageUrl } from "../../utils/helpers";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderDetails({ order }) {
  const navigate = useNavigate();
  const [cancelling, setCancelling] = useState(false);

  if (!order) return null;

  const items = order.items || [];
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      setCancelling(true);
      await orderApi.cancelOrder(order.id);
      navigate(0); // reload page
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/orders" className="text-blue-500 hover:underline text-sm">
          ← Back to Orders
        </Link>
      </div>

      {/* Order info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed: {formatDateTime(order.placedAt)}
            </p>
            {order.deliveredAt && (
              <p className="text-sm text-green-600 mt-1">
                Delivered: {formatDateTime(order.deliveredAt)}
              </p>
            )}
          </div>
          <span
            className={`text-sm px-3 py-1 rounded-full font-medium ${
              statusColors[order.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Addresses */}
        <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Shipping Address
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {order.shippingAddress || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Billing Address
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {order.billingAddress || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>

        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    📦
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-medium hover:text-blue-500 truncate block"
                >
                  {item.productName}
                </Link>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>

              <div className="font-bold whitespace-nowrap">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-3 border-t">
            <span>Total</span>
            <span className="text-blue-600">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between text-sm">
          <div>
            <span className="text-gray-500">Payment Method: </span>
            <span className="font-medium">{order.paymentMethod || "N/A"}</span>
          </div>
          <div>
            <span className="text-gray-500">Payment Status: </span>
            <span className="font-medium">
              {order.paymentStatus || "PENDING"}
            </span>
          </div>
        </div>

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition disabled:bg-gray-400"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>
    </div>
  );
}
