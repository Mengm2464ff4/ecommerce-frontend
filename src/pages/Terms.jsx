import { motion } from "framer-motion";

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using ShopHub, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.",
    },
    {
      title: "2. Account Registration",
      content:
        "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your password and all activities that occur under your account.",
    },
    {
      title: "3. Products & Pricing",
      content:
        "All prices are in USD and subject to change without notice. We reserve the right to modify or discontinue products at any time. Colors may vary slightly due to monitor settings.",
    },
    {
      title: "4. Orders & Payment",
      content:
        "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be received before order processing.",
    },
    {
      title: "5. Shipping & Delivery",
      content:
        "Shipping times are estimates and not guaranteed. We are not responsible for delays caused by carriers or customs. Risk of loss passes to you upon delivery to the carrier.",
    },
    {
      title: "6. Returns & Refunds",
      content:
        "Returns are accepted within 30 days of delivery. Items must be unused and in original packaging. Refunds are processed within 5-7 business days of receiving the return.",
    },
    {
      title: "7. Intellectual Property",
      content:
        "All content on ShopHub, including logos, images, text, and software, is owned by ShopHub or its licensors and protected by copyright laws. You may not use our content without permission.",
    },
    {
      title: "8. Prohibited Uses",
      content:
        "You may not use our services for illegal purposes, to violate laws, to infringe on intellectual property, to transmit malware, or to attempt unauthorized access to our systems.",
    },
    {
      title: "9. Limitation of Liability",
      content:
        "ShopHub is provided 'as is' without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of our services.",
    },
    {
      title: "10. Governing Law",
      content:
        "These terms are governed by the laws of Cambodia. Any disputes will be resolved in the courts of Phnom Penh.",
    },
    {
      title: "11. Changes to Terms",
      content:
        "We may update these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.",
    },
    {
      title: "12. Contact",
      content:
        "For questions about these terms, contact us at legal@shophub.com.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="bg-gray-50 dark:bg-gray-900 py-16 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Last updated: January 1, 2026
          </motion.p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
        >
          Please read these terms carefully before using ShopHub. By using our
          services, you agree to be bound by these terms.
        </motion.p>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {section.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
