import { useState } from "react";
import {
  CreditCard,
  Lock,
  Calendar,
  User,
  Hash,
  ShieldCheck,
} from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

export default function PaymentForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "cardNumber") formatted = formatCardNumber(value);
    if (name === "expiry") formatted = formatExpiry(value);
    if (name === "cvv") formatted = value.replace(/\D/g, "").slice(0, 4);

    setForm({ ...form, [name]: formatted });
    setErrors({ ...errors, [name]: "" });
  };

  const detectCardBrand = () => {
    const num = form.cardNumber.replace(/\s/g, "");
    if (num.startsWith("4"))
      return <FaCcVisa className="text-3xl text-blue-600" />;
    if (/^5[1-5]/.test(num))
      return <FaCcMastercard className="text-3xl text-red-500" />;
    if (/^3[47]/.test(num))
      return <FaCcAmex className="text-3xl text-blue-500" />;
    return <CreditCard className="w-6 h-6 text-gray-400" />;
  };

  const validate = () => {
    const errs = {};
    const num = form.cardNumber.replace(/\s/g, "");

    if (num.length !== 16) errs.cardNumber = "Card number must be 16 digits";
    if (!form.cardHolder.trim())
      errs.cardHolder = "Cardholder name is required";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errs.expiry = "Use MM/YY format";
    if (form.cvv.length < 3) errs.cvv = "CVV must be at least 3 digits";

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-500" />
        Card Details
      </h2>

      {/* Card number */}
      <div>
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            className="w-full pl-10 pr-14 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {detectCardBrand()}
          </div>
        </div>
        {errors.cardNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Card holder */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Cardholder Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="cardHolder"
            value={form.cardHolder}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full pl-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {errors.cardHolder && (
          <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>
        )}
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expiry</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className="w-full pl-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.expiry && (
            <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CVV</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              name="cvv"
              value={form.cvv}
              onChange={handleChange}
              placeholder="123"
              className="w-full pl-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.cvv && (
            <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4" />
        {loading ? "Processing..." : "Pay Now"}
      </button>

      <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        Your payment information is encrypted and secure
      </p>
    </form>
  );
}
