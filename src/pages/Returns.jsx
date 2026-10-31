import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Package,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
            <RotateCcw className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Returns & Exchanges
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Not satisfied? Here's how to send it back.
          </p>
        </div>

        {/* Window */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              14-Day Return Window
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            You have <strong>14 days</strong> from the delivery date to return
            an item. After 14 days, we can no longer accept returns.
          </p>
        </section>

        {/* What can be returned */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-green-200 dark:border-green-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Eligible for Return
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Unused and unworn items</li>
              <li>• Original packaging intact</li>
              <li>• Tags still attached</li>
              <li>• Receipt or order confirmation</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Not Eligible
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Worn, washed, or damaged items</li>
              <li>• Intimates and swimwear</li>
              <li>• Gift cards</li>
              <li>• Final-sale items</li>
            </ul>
          </div>
        </div>

        {/* How to return */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              How to Return an Item
            </h2>
          </div>
          <ol className="space-y-4">
            {[
              "Log into your account and go to Orders.",
              "Select the order and click 'Request Return'.",
              "Choose a reason and confirm the return.",
              "Print the prepaid return label we email you.",
              "Pack the item and drop it at the nearest courier.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <p className="text-gray-600 dark:text-gray-400 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Refunds note */}
        <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-5">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Refunds are processed within 5–7 business days after we receive the
            item.{" "}
            <a
              href="/refund-policy"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Read refund policy →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
