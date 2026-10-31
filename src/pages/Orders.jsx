import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Moon,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  Truck,
  X,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/order";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getImageUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  return `${API_BASE.replace(/\/$/, "")}/${String(path).replace(/^\//, "")}`;
};

const formatMoney = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(amount) ? amount : 0);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getItemSubtotal = (order) => {
  return (order?.items || []).reduce((total, item) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 0);

    return total + price * quantity;
  }, 0);
};

const getInvoiceValues = (order) => {
  const total = Number(order?.totalAmount || 0);
  const calculatedSubtotal = getItemSubtotal(order);

  const subtotal =
    order?.subtotal !== undefined ? Number(order.subtotal) : calculatedSubtotal;

  const tax = Number(order?.tax || 0);
  const shipping = Number(order?.shippingFee || 0);

  const additionalAmount = total - subtotal;

  return {
    subtotal: Number.isFinite(subtotal) ? subtotal : 0,
    tax: Number.isFinite(tax) ? tax : 0,
    shipping:
      shipping > 0
        ? shipping
        : tax === 0 && additionalAmount > 0
          ? additionalAmount
          : shipping,
    total: Number.isFinite(total) ? total : 0,
  };
};

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    shortLabel: "Pending",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
    icon: Clock,
    stepIndex: 0,
  },
  PROCESSING: {
    label: "Processing",
    shortLabel: "Processing",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/20",
    icon: Loader2,
    stepIndex: 1,
  },
  CONFIRMED: {
    label: "Confirmed",
    shortLabel: "Confirmed",
    color: "text-indigo-700 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    border: "border-indigo-200 dark:border-indigo-500/20",
    icon: CheckCircle2,
    stepIndex: 1,
  },
  SHIPPED: {
    label: "In Transit",
    shortLabel: "Shipped",
    color: "text-purple-700 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-500/20",
    icon: Truck,
    stepIndex: 2,
  },
  DELIVERED: {
    label: "Delivered",
    shortLabel: "Delivered",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
    icon: CheckCircle2,
    stepIndex: 3,
  },
  CANCELLED: {
    label: "Cancelled",
    shortLabel: "Cancelled",
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/20",
    icon: XCircle,
    stepIndex: -1,
  },
};

const ImageWithFallback = ({ src, alt, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`${className} flex flex-shrink-0 items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600`}
      >
        <Package className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Product"}
      onError={() => setHasError(true)}
      className={`${className} flex-shrink-0 object-cover`}
    />
  );
};

const OrderTrackerStepper = ({ status }) => {
  const steps = [
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const currentStep = STATUS_CONFIG[status]?.stepIndex ?? 0;

  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
        <XCircle className="h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
        <span>
          This order was cancelled. Refund status:
          <strong className="ml-1">check your payment method.</strong>
        </span>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200 dark:bg-gray-800" />

        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, index) => {
          const completed = index <= currentStep;
          const current = index === currentStep;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  completed
                    ? "bg-blue-600 text-white ring-4 ring-white shadow-md dark:ring-gray-900"
                    : "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                } ${current ? "scale-110" : ""}`}
              >
                {completed ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  index + 1
                )}
              </div>

              <span
                className={`mt-1.5 text-center text-[10px] font-medium sm:text-xs ${
                  completed
                    ? "font-semibold text-gray-900 dark:text-gray-100"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InvoicePreviewModal = ({ order, onClose, onDownload, isDownloading }) => {
  if (!order) return null;

  const invoice = getInvoiceValues(order);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="my-8 w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">
              Invoice Preview #{order.orderNumber || order.id}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Close invoice preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6 text-xs text-gray-700 dark:text-gray-300 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row dark:border-gray-800">
            <div>
              <div className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                INVOICE
              </div>
              <p className="mt-1 text-gray-400">Invoice ID: INV-{order.id}</p>
              <p className="text-gray-400">
                Date: {formatDate(order.placedAt || order.createdAt)}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Acme Commerce Inc.
              </p>
              <p className="text-gray-500">100 Tech Blvd, Suite 500</p>
              <p className="text-gray-500">San Francisco, CA 94107</p>
              <p className="text-gray-500">support@acmecommerce.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Billed To
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {order.customerName || "Customer"}
              </p>
              <p className="text-gray-500">{order.customerEmail || "—"}</p>
            </div>

            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Shipping Address
              </p>
              <p>{order.shippingAddress || "—"}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100 font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-800/80 dark:text-gray-300">
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {(order.items || []).map((item, index) => {
                  const price = Number(item.price || 0);
                  const quantity = Number(item.quantity || 0);

                  return (
                    <tr key={item.id || index}>
                      <td className="p-3 font-medium text-gray-900 dark:text-white">
                        {item.productName || item.name || "Product"}
                        {item.color && (
                          <span className="block text-[10px] font-normal text-gray-400">
                            Color: {item.color}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">{quantity}</td>
                      <td className="p-3 text-right">{formatMoney(price)}</td>
                      <td className="p-3 text-right font-semibold">
                        {formatMoney(price * quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full space-y-2 text-xs sm:w-1/2">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatMoney(invoice.subtotal)}</span>
              </div>

              {invoice.tax > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span>
                  <span>{formatMoney(invoice.tax)}</span>
                </div>
              )}

              {invoice.shipping > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{formatMoney(invoice.shipping)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900 dark:border-gray-800 dark:text-white">
                <span>Total Amount</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {formatMoney(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => onDownload(order)}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const OrderDetailDrawer = ({
  order,
  onClose,
  showToast,
  onDownloadInvoice,
  downloadingId,
  onOpenPreview,
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const invoice = getInvoiceValues(order);
  const isDownloading = downloadingId === order.id;

  const handleCopyTracking = async () => {
    if (!order.trackingNumber) return;

    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      showToast("Tracking code copied to clipboard");

      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      showToast("Could not copy tracking code", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="fixed inset-0 flex justify-end pointer-events-none">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="pointer-events-auto mt-12 flex h-[calc(100%-3rem)] w-full flex-col rounded-t-3xl border-t border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 md:mt-0 md:h-full md:max-w-xl md:rounded-none md:border-l md:border-t-0"
        >
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Order #{order.orderNumber || order.id}
                </h2>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${status.bg} ${status.color}`}
                >
                  {status.shortLabel}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Placed on {formatDate(order.placedAt || order.createdAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label="Close order details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Tracking & Fulfillment Status
              </h4>
              <OrderTrackerStepper status={order.status} />
            </div>

            {order.trackingNumber && order.trackingNumber !== "N/A" && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-600 p-2.5 text-white">
                    <Truck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {order.carrier || "Carrier"}
                    </p>
                    <p className="font-mono text-gray-500 dark:text-gray-400">
                      {order.trackingNumber}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white px-4 py-2.5 font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-300 sm:w-auto"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy Tracking"}
                </button>
              </div>
            )}

            <div>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Purchased Items ({order.items?.length || 0})
              </h4>

              <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 px-4 dark:divide-gray-800 dark:border-gray-800">
                {(order.items || []).map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center gap-3.5 py-3.5"
                  >
                    <ImageWithFallback
                      src={getImageUrl(item.productImageUrl || item.imageUrl)}
                      alt={item.productName || item.name}
                      className="h-14 w-14 rounded-xl border border-gray-200/60 dark:border-gray-700/60"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {item.productName || item.name || "Product"}
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                        Color: {item.color || "Standard"} • Qty:{" "}
                        {item.quantity || 0}
                      </p>
                    </div>

                    <p className="flex-shrink-0 text-sm font-bold text-gray-900 dark:text-white">
                      {formatMoney(
                        Number(item.price || 0) * Number(item.quantity || 0),
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
                <h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  Delivery Address
                </h5>

                <p className="text-xs font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                  {order.shippingAddress || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
                <h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                  Invoice Breakdown
                </h5>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Items Subtotal</span>
                    <span>{formatMoney(invoice.subtotal)}</span>
                  </div>

                  {invoice.tax > 0 && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Tax</span>
                      <span>{formatMoney(invoice.tax)}</span>
                    </div>
                  )}

                  {invoice.shipping > 0 && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span>{formatMoney(invoice.shipping)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-gray-200/60 pt-1.5 font-bold text-gray-900 dark:border-gray-700/60 dark:text-white">
                    <span>Total Charged</span>
                    <span>{formatMoney(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/90 sm:p-5">
            <button
              type="button"
              onClick={() => onOpenPreview(order)}
              className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Eye className="h-4 w-4 text-gray-500" />
              Preview
            </button>

            <button
              type="button"
              onClick={() => onDownloadInvoice(order)}
              disabled={isDownloading}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isDownloading ? "Downloading..." : "Download PDF Invoice"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed left-4 right-4 top-4 z-[60] flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-xs font-semibold shadow-xl sm:left-auto sm:right-5 sm:max-w-md ${
          type === "error"
            ? "border-rose-700 bg-rose-900 text-white"
            : "border-gray-800 bg-gray-900 text-white dark:border-gray-200 dark:bg-white dark:text-gray-900"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {type === "error" ? (
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-300" />
          ) : (
            <Sparkles className="h-4 w-4 flex-shrink-0 text-amber-400" />
          )}

          <span>{message}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 opacity-70 hover:opacity-100"
          aria-label="Close notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [previewOrder, setPreviewOrder] = useState(null);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });
  const [downloadingId, setDownloadingId] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast((current) =>
        current.message === message
          ? { message: "", type: "success" }
          : current,
      );
    }, 4000);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await orderApi.getMyOrders(0, 50);

        console.log("Full API response:", response?.data);

        const orderList =
          response?.data?.data?.content ??
          response?.data?.content ??
          response?.data ??
          [];

        if (mounted) {
          setOrders(Array.isArray(orderList) ? orderList : []);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);

        if (mounted) {
          setOrders([]);
          showToast("Failed to load orders", "error");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, [showToast]);

  useEffect(() => {
    const closeWithEscape = (event) => {
      if (event.key !== "Escape") return;

      setSelectedOrder(null);
      setPreviewOrder(null);
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  const handleDownloadInvoice = async (order) => {
    if (!order?.id || downloadingId) return;

    try {
      setDownloadingId(order.id);

      const response = await orderApi.downloadInvoicePdf(order.id);

      const blob =
        response?.data instanceof Blob
          ? response.data
          : new Blob([response?.data], {
              type: "application/pdf",
            });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Invoice-${order.orderNumber || order.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      showToast(
        `Downloaded invoice for order ${order.orderNumber || order.id}`,
      );
    } catch (error) {
      console.error("Failed to download invoice:", error);

      const errorMessage =
        error?.response?.data?.message || error?.message || "Server error";

      showToast(`Failed to download invoice: ${errorMessage}`, "error");
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return orders.filter((order) => {
      let matchesTab = true;

      if (selectedTab === "ACTIVE") {
        matchesTab = ["PENDING", "PROCESSING", "CONFIRMED", "SHIPPED"].includes(
          order.status,
        );
      }

      if (selectedTab === "COMPLETED") {
        matchesTab = order.status === "DELIVERED";
      }

      if (selectedTab === "CANCELLED") {
        matchesTab = order.status === "CANCELLED";
      }

      if (!query) return matchesTab;

      const orderNumber = String(
        order.orderNumber || order.id || "",
      ).toLowerCase();

      const carrier = String(order.carrier || "").toLowerCase();
      const customer = String(order.customerName || "").toLowerCase();

      const matchesItem = (order.items || []).some((item) =>
        String(item.productName || item.name || "")
          .toLowerCase()
          .includes(query),
      );

      return (
        matchesTab &&
        (orderNumber.includes(query) ||
          carrier.includes(query) ||
          customer.includes(query) ||
          matchesItem)
      );
    });
  }, [orders, searchQuery, selectedTab]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTab("ALL");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/70 text-gray-900 transition-colors duration-300 dark:from-gray-950 dark:via-gray-950 dark:to-blue-950/30 dark:text-gray-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -left-40 top-[35%] h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute bottom-[-120px] right-[15%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-3.5 py-6 sm:px-6 sm:py-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <span className="text-xl">←</span>
          Back to Shopping
        </button>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                My Orders & Invoices
              </h1>

              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {filteredOrders.length}
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Track shipments, manage purchases, and download PDF invoices.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center self-start rounded-2xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 sm:self-auto"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>
        </div>

        <div className="mb-6 space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by order number, item, customer, or carrier..."
              className="w-full rounded-2xl border border-gray-200/80 bg-white py-2.5 pl-9 pr-8 text-xs text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/40 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: "All Orders" },
              { id: "ACTIVE", label: "In Progress" },
              { id: "COMPLETED", label: "Delivered" },
              { id: "CANCELLED", label: "Cancelled" },
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`min-h-[40px] whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  selectedTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "border border-gray-200/80 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-500">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-gray-200/80 bg-white px-4 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30">
              <ShoppingBag className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>

            <h3 className="mb-1 text-base font-bold text-gray-900 dark:text-white">
              No orders found
            </h3>

            <p className="mx-auto mb-5 max-w-xs text-xs text-gray-500 dark:text-gray-400">
              We could not find orders matching your current filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="min-h-[44px] rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.05 },
              },
            }}
            className="space-y-4"
          >
            {filteredOrders.map((order) => {
              const status =
                STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = status.icon;
              const items = order.items || [];
              const isDownloading = downloadingId === order.id;

              return (
                <motion.div
                  key={order.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition hover:border-blue-500/40 dark:border-gray-800/80 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/70 px-4 py-3.5 dark:border-gray-800/80 dark:bg-gray-800/20 sm:px-5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                        <Package className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate text-xs font-bold text-gray-900 dark:text-white sm:text-sm">
                            #{order.orderNumber || order.id}
                          </span>

                          <span className="hidden text-gray-300 dark:text-gray-700 sm:inline">
                            •
                          </span>

                          <span className="text-[11px] text-gray-500 dark:text-gray-400">
                            {formatDate(order.placedAt || order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${status.bg} ${status.color} ${status.border}`}
                    >
                      <StatusIcon
                        className={`h-3 w-3 ${
                          order.status === "PROCESSING" ? "animate-spin" : ""
                        }`}
                      />
                      <span className="hidden sm:inline">{status.label}</span>
                      <span className="sm:hidden">{status.shortLabel}</span>
                    </span>
                  </div>

                  <div className="flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center sm:p-5">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
                      {items.slice(0, 4).map((item, index) => (
                        <ImageWithFallback
                          key={item.id || index}
                          src={getImageUrl(
                            item.productImageUrl || item.imageUrl,
                          )}
                          alt={item.productName || item.name}
                          className="h-14 w-14 rounded-xl border border-gray-200/60 dark:border-gray-700/60"
                        />
                      ))}

                      <div className="pl-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                          {items.length} {items.length === 1 ? "Item" : "Items"}
                        </p>
                        <p className="mt-0.5 text-xs font-extrabold text-blue-600 dark:text-blue-400">
                          {formatMoney(order.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2 dark:border-gray-800 md:border-t-0 md:pt-0">
                      <button
                        type="button"
                        onClick={() => setPreviewOrder(order)}
                        className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:flex-none"
                      >
                        <Eye className="h-3.5 w-3.5 text-gray-500" />
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(order)}
                        disabled={isDownloading}
                        className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/50 px-3.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100/60 disabled:opacity-50 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-300 sm:flex-none"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        {isDownloading ? "Downloading..." : "Invoice PDF"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="flex min-h-[40px] items-center justify-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                      >
                        Details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            showToast={showToast}
            onDownloadInvoice={handleDownloadInvoice}
            downloadingId={downloadingId}
            onOpenPreview={setPreviewOrder}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewOrder && (
          <InvoicePreviewModal
            order={previewOrder}
            onClose={() => setPreviewOrder(null)}
            onDownload={handleDownloadInvoice}
            isDownloading={downloadingId === previewOrder.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
