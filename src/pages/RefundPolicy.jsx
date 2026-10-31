import { DollarSign, Clock, CheckCircle2, XCircle, Info } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Refund Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            How and when we issue refunds.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Processing Time
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Once we receive your returned item, refunds are processed within{" "}
              <strong>5–7 business days</strong>. The money is credited back to
              your original payment method. Bank processing may add another 3–5
              business days depending on your provider.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-green-200 dark:border-green-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Full Refund
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Item arrived damaged</li>
                <li>• Wrong item was shipped</li>
                <li>• Item never arrived</li>
                <li>• Returned within 14 days, unused</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  No Refund
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Returned after 14 days</li>
                <li>• Item used or damaged by you</li>
                <li>• Final-sale or clearance items</li>
                <li>• Digital products already downloaded</li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Partial Refunds
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              In some cases (e.g., a small defect you choose to keep), we can
              offer a partial refund. Contact support and we'll work something
              out.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Shipping Fees
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Original shipping fees are refunded only when the return is due to
              our error (wrong or damaged item). For all other returns, the
              shipping fee is non-refundable.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Need help with a refund?{" "}
              <a
                href="/contact"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Contact our support team →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
