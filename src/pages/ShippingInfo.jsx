import {
  Truck,
  Clock,
  MapPin,
  Package,
  Globe,
  ShieldCheck,
} from "lucide-react";

export default function ShippingInfo() {
  const options = [
    {
      icon: Truck,
      title: "Standard Shipping",
      time: "5–7 business days",
      price: "Free over $50 · $5 otherwise",
    },
    {
      icon: Clock,
      title: "Express Shipping",
      time: "2–3 business days",
      price: "$12.99",
    },
    {
      icon: Package,
      title: "Overnight",
      time: "Next business day",
      price: "$24.99",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Shipping Information
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Everything you need to know about how we deliver your orders.
          </p>
        </div>

        {/* Shipping options */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            Shipping Options
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {options.map(({ icon: Icon, title, time, price }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {time}
                </p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {price}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage */}
        <section className="mb-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Where We Ship
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            We currently ship to all major cities and provinces. Remote areas
            may require an extra 1–2 business days.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li>Nationwide delivery within the country</li>
            <li>International shipping available on request</li>
            <li>PO Boxes accepted for standard shipping only</li>
          </ul>
        </section>

        {/* Processing time */}
        <section className="mb-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Order Processing
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Orders placed before <strong>2:00 PM</strong> on a business day are
            processed the same day. Orders placed after 2 PM or on weekends are
            processed the next business day.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            You will receive a tracking link by email once your order ships.
          </p>
        </section>

        {/* Tracking */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 p-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Track Your Order
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Already placed an order? Track its status in real time.
          </p>
          <a
            href="/track-order"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition shadow-lg shadow-blue-500/30"
          >
            <Truck className="w-4 h-4" />
            Track Order
          </a>
        </section>

        {/* Note */}
        <div className="mt-10 flex items-start gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All shipments are insured and require a signature on delivery for
            orders over $500.
          </p>
        </div>
      </div>
    </div>
  );
}
