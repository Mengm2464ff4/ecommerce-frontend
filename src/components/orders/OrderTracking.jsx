const STEPS = [
  { key: "PENDING", label: "Order Placed", icon: "📝" },
  { key: "CONFIRMED", label: "Confirmed", icon: "✅" },
  { key: "PROCESSING", label: "Processing", icon: "⚙️" },
  { key: "SHIPPED", label: "Shipped", icon: "🚚" },
  { key: "DELIVERED", label: "Delivered", icon: "🏠" },
];

export default function OrderTracking({ status }) {
  if (status === "CANCELLED") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center">
        ❌ This order has been cancelled
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Order Tracking</h2>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-0" />
        <div
          className="absolute top-6 left-6 h-0.5 bg-blue-500 transition-all duration-500"
          style={{
            width: `calc(${
              (activeIndex / (STEPS.length - 1)) * 100
            }% - ${activeIndex === 0 ? "0px" : "12px"})`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {STEPS.map((step, index) => {
            const isComplete = index <= activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all z-10 ${
                    isComplete
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-blue-200" : ""}`}
                >
                  {step.icon}
                </div>
                <p
                  className={`text-xs mt-2 text-center font-medium ${
                    isComplete ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
