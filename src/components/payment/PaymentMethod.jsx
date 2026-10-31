import {
  CreditCard,
  Wallet,
  Banknote,
  Building2,
  Smartphone,
} from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal } from "react-icons/fa";


const PAYMENT_METHODS = [
  {
    id: "ABAPAY",
    label: "ABA PayWay (KHQR)",
    description: "Scan QR to pay",
    Icon: Smartphone,
  },
  {
    id: "COD",
    label: "Cash on Delivery",
    description: "Pay when you receive",
    Icon: Banknote,
  },
];


export default function PaymentMethod({ value, onChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-500" />
        Payment Method
      </h2>

      <div className="space-y-3">
        {PAYMENT_METHODS.map(({ id, label, description, Icon }) => (
          <label
            key={id}
            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
              value === id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={id}
              checked={value === id}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-500"
            />

            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>

            <div className="flex-1">
              <p className="font-medium">{label}</p>
              <p className="text-sm text-gray-500">{description}</p>
            </div>

            {id === "CARD" && (
              <div className="hidden sm:flex items-center gap-1 text-2xl text-gray-600">
                <FaCcVisa />
                <FaCcMastercard />
                <FaCcAmex />
              </div>
            )}

            {id === "PAYPAL" && (
              <FaPaypal className="hidden sm:block text-2xl text-blue-600" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
