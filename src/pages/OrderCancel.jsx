import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function OrderCancel() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Your payment was cancelled. No charges were made.
        </p>
        <Link
          to="/cart"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
        >
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
