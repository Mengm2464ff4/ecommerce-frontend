import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over $50",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% protected checkout",
    color: "text-green-600 dark:text-green-400",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    subtitle: "Money back guarantee",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Always here to help",
    color: "text-orange-600 dark:text-orange-400",
  },
];

export default function TrustBar() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-2">
                <Icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
