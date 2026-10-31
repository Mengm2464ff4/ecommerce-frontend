import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  PAID: {
    Icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    title: "Payment Successful",
    description: "Your payment has been processed successfully.",
    showRetry: false,
  },
  SUCCESS: {
    Icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    title: "Payment Successful",
    description: "Your payment has been processed successfully.",
    showRetry: false,
  },
  PENDING: {
    Icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    title: "Payment Pending",
    description: "Your payment is being processed. Please wait a moment.",
    showRetry: false,
  },
  FAILED: {
    Icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
    title: "Payment Failed",
    description: "Something went wrong with your payment. Please try again.",
    showRetry: true,
  },
  REFUNDED: {
    Icon: RotateCw,
    color: "text-blue-600",
    bg: "bg-blue-100",
    title: "Payment Refunded",
    description: "Your payment has been refunded.",
    showRetry: false,
  },
};

export default function PaymentStatus({
  status = "PENDING",
  orderNumber,
  amount,
  onRetry,
}) {
  const navigate = useNavigate();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const { Icon, color, bg, title, description, showRetry } = config;

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div
          className={`${bg} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <Icon className={`w-12 h-12 ${color}`} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>

        {/* Order info */}
        {(orderNumber || amount != null) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
            {orderNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">#{orderNumber}</span>
              </div>
            )}
            {amount != null && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-blue-600">
                  ${Number(amount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${color}`}>{status}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Try Again
            </button>
          )}

          <button
            onClick={() => navigate("/orders")}
            className="w-full border-2 border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full text-gray-600 hover:text-blue-500 py-2 text-sm transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
