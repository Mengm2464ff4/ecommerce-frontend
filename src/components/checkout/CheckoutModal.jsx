import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { orderApi } from "../../api/order";
import { formatPrice } from "../../utils/helpers";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  CreditCard,
  Truck,
  User,
  MapPin,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Package,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Information", icon: User },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Complete Order", icon: Check },
];

export default function CheckoutModal({ open, onClose }) {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step] = useState(1);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    shippingAddress: "",
    postalCode: "",
    state: "",
    note: "",
    paymentMethod: "ABAPAY",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const shipping = totalPrice > 50 ? 0 : 5;
  const vat = totalPrice * 0.1;
  const grandTotal = totalPrice + shipping + vat;

  // Lock body scroll while modal is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  const handleChange = (field) => (e) =>
    setAddress({ ...address, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.shippingAddress.trim()) {
      setError("Shipping address is required");
      return;
    }
    setError("");
    setShowConfirm(true);
  };

  const confirmOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const orderRes = await orderApi.createOrder({
        shippingAddress: address.shippingAddress,
        billingAddress: address.billingAddress || address.shippingAddress,
        paymentMethod: "ABAPAY",
      });

      const orderData = orderRes?.data?.data ?? orderRes?.data;
      const orderId =
        orderData?.id ??
        orderData?.orderId ??
        orderData?._id ??
        orderData?.order?.id;

      if (!orderId) throw new Error("Order created but no ID returned");

      setShowConfirm(false);
      clearCart?.();
      onClose?.();
      navigate(`/payment/${orderId}`);
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Failed to place order");
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto"
        >
          {/* Close button — floating top-right */}
          <button
            onClick={() => !loading && onClose()}
            disabled={loading}
            className="fixed top-4 right-4 z-[60] w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 shadow-lg transition disabled:opacity-50"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-h-full flex items-start sm:items-center justify-center p-4 py-10 sm:py-16">
            <motion.div
              initial={{ scale: 0.96, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 24, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="w-full max-w-6xl bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="py-8 px-4 sm:px-8">
                {/* Header inside modal */}
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Checkout
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Complete your purchase in a few steps
                  </p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center mb-8">
                  {STEPS.map((s, idx) => {
                    const Icon = s.icon;
                    const active = s.id <= step;
                    return (
                      <div key={s.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition ${
                              active
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-gray-300 dark:border-gray-700 text-gray-400"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span
                            className={`mt-2 text-[11px] font-medium ${
                              active
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-400"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div
                            className={`w-12 sm:w-20 h-0.5 mx-2 mb-6 ${
                              s.id < step
                                ? "bg-blue-600"
                                : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {error && (
                  <div className="mb-5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 p-3.5 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* LEFT — form */}
                    <div className="lg:col-span-3 space-y-5">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          Delivery Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field
                            label="Name"
                            value={address.name}
                            onChange={handleChange("name")}
                            placeholder="Enter Name"
                            required
                          />
                          <Field
                            label="Phone No"
                            value={address.phone}
                            onChange={handleChange("phone")}
                            placeholder="Enter Phone"
                            required
                          />
                          <div className="sm:col-span-2">
                            <Field
                              label="Email Address"
                              type="email"
                              value={address.email}
                              onChange={handleChange("email")}
                              placeholder="Enter Email Address"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Field
                              label="Delivery Address"
                              value={address.shippingAddress}
                              onChange={handleChange("shippingAddress")}
                              placeholder="Enter Delivery Address"
                              required
                            />
                          </div>
                          <Field
                            label="Postal Code"
                            value={address.postalCode}
                            onChange={handleChange("postalCode")}
                            placeholder="Enter Postal Code"
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              State
                            </label>
                            <select
                              value={address.state}
                              onChange={handleChange("state")}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select State</option>
                              <option value="Phnom Penh">Phnom Penh</option>
                              <option value="Siem Reap">Siem Reap</option>
                              <option value="Battambang">Battambang</option>
                              <option value="Sihanoukville">
                                Sihanoukville
                              </option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Note{" "}
                              <span className="text-gray-400 font-normal">
                                (Optional)
                              </span>
                            </label>
                            <textarea
                              value={address.note}
                              onChange={handleChange("note")}
                              rows={3}
                              placeholder="Enter Note"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          Payment Method
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <PaymentOption
                            value="ABAPAY"
                            current={address.paymentMethod}
                            onChange={handleChange("paymentMethod")}
                            label="ABA PayWay (KHQR)"
                            sub="Scan QR to pay"
                            icon={CreditCard}
                          />
                          <PaymentOption
                            value="COD"
                            current={address.paymentMethod}
                            onChange={handleChange("paymentMethod")}
                            label="Cash on Delivery"
                            sub="Pay when it arrives"
                            icon={Truck}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || items.length === 0}
                        className="lg:hidden w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Proceed"
                        )}
                      </button>
                    </div>

                    {/* RIGHT — summary */}
                    <div className="lg:col-span-2">
                      <div className="lg:sticky lg:top-4 space-y-4">
                        <div className="bg-gradient-to-br from-gray-900 to-blue-950 text-white rounded-2xl p-5 sm:p-6 shadow-lg">
                          <h2 className="text-base font-semibold mb-4">
                            Your Cart
                          </h2>

                          <div className="space-y-2.5 mb-5 max-h-64 overflow-y-auto pr-1">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-2.5"
                              >
                                <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/20 flex-shrink-0">
                                  {item.productImageUrl ? (
                                    <img
                                      src={`http://localhost:8080${item.productImageUrl}`}
                                      alt={item.productName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="w-4 h-4 text-white/60" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">
                                    {item.productName}
                                  </p>
                                  <p className="text-[11px] text-white/60">
                                    {formatPrice(item.price)}
                                  </p>
                                </div>
                                <span className="text-[11px] bg-white/20 rounded-md px-1.5 py-0.5">
                                  ×{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <h3 className="text-xs font-semibold mb-3 text-white/90 uppercase tracking-wide">
                            Price Details
                          </h3>
                          <div className="bg-white/10 rounded-xl p-3.5 space-y-2 text-sm">
                            <Row
                              label="Items"
                              value={formatPrice(totalPrice)}
                            />
                            <Row label="VAT (10%)" value={formatPrice(vat)} />
                            <Row
                              label="Shipping"
                              value={
                                shipping === 0 ? "Free" : formatPrice(shipping)
                              }
                            />
                            <div className="border-t border-white/20 pt-2 mt-2 flex justify-between">
                              <span className="font-semibold">Total</span>
                              <span className="font-bold text-base">
                                {formatPrice(grandTotal)}
                              </span>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={loading || items.length === 0}
                            className="hidden lg:flex mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:bg-gray-500 items-center justify-center gap-2"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Proceed"
                            )}
                          </button>

                          <p className="text-[11px] text-center text-white/60 mt-3 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Secure checkout
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Confirm step modal */}
          <AnimatePresence>
            {showConfirm && (
              <ConfirmModal
                address={address}
                items={items}
                grandTotal={grandTotal}
                loading={loading}
                onConfirm={confirmOrder}
                onCancel={() => setShowConfirm(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Sub-components ---------- */

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
}

function PaymentOption({ value, current, onChange, label, sub, icon: Icon }) {
  const active = current === value;
  return (
    <label
      className={`cursor-pointer rounded-xl border-2 p-3.5 transition ${
        active
          ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
      }`}
    >
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        checked={active}
        onChange={onChange}
        className="sr-only"
      />
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            active
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {label}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{sub}</p>
        </div>
      </div>
    </label>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-white/80">
      <span>{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function ConfirmModal({
  address,
  items,
  grandTotal,
  loading,
  onConfirm,
  onCancel,
}) {
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
      >
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-blue-600" />
        </div>

        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Confirm your order
        </h3>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Review your delivery details before placing the order
        </p>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Name</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {address.name || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Phone</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {address.phone || "—"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
              Deliver to
            </span>
            <span className="font-medium text-gray-900 dark:text-white text-right">
              {address.shippingAddress || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Payment</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {address.paymentMethod === "ABAPAY"
                ? "ABA PayWay (KHQR)"
                : "Cash on Delivery"}
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-baseline">
            <span className="text-gray-500 dark:text-gray-400">
              Total ({itemCount} items)
            </span>
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Placing...
              </>
            ) : (
              "Confirm & Pay"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
