import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Free shipping is available on orders over $50.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. International shipping takes 7-14 business days depending on the destination.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive an email with a tracking number. You can also track your order from your account dashboard.",
      },
      {
        q: "Can I change my shipping address after ordering?",
        a: "If your order hasn't shipped yet, contact us immediately. Once shipped, we cannot change the address.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day money-back guarantee. Items must be unused and in original packaging. Return shipping is free for defective items.",
      },
      {
        q: "How do I return an item?",
        a: "Log into your account, go to Orders, select the item, and click 'Request Return'. We'll email you a return label within 24 hours.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5-7 business days after we receive the returned item. The money will be credited back to your original payment method.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, PayPal, Apple Pay, and Google Pay. All payments are secured with 256-bit SSL encryption.",
      },
      {
        q: "Is it safe to use my credit card?",
        a: "Absolutely. We use industry-standard encryption and never store your card details on our servers.",
      },
      {
        q: "Do you offer payment plans?",
        a: "Yes, we offer installment plans for orders over $200. Choose 'Pay in 4' at checkout.",
      },
    ],
  },
  {
    category: "Account & Security",
    items: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the top right corner, enter your email and password, and you're ready to start shopping.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Click 'Forgot Password' on the login page. We'll email you a link to reset your password.",
      },
      {
        q: "How do I update my account information?",
        a: "Go to your Profile page from the account menu. You can update your name, email, address, and password there.",
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&auto=format&fit=crop"
          alt="FAQ"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-24 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Help Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/95 max-w-2xl mx-auto drop-shadow"
          >
            Find answers to common questions about orders, shipping, returns,
            and more.
          </motion.p>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        {FAQS.map((group, gi) => (
          <div key={gi} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {group.category}
            </h2>

            <div className="space-y-3">
              {group.items.map((item, ii) => {
                const key = `${gi}-${ii}`;
                const isOpen = openIndex === key;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ii * 0.05 }}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still need help? */}
        <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}
