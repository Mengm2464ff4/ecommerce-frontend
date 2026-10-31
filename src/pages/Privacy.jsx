import { motion } from "framer-motion";

export default function Privacy() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "**Personal Information:** Name, email, phone number, shipping address, and payment information when you place an order.",
        "**Account Information:** Username, password (encrypted), and preferences when you create an account.",
        "**Usage Data:** Pages visited, products viewed, and search queries to improve your experience.",
        "**Device Information:** IP address, browser type, and operating system for security purposes.",
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "To process and fulfill your orders, including shipping and delivery.",
        "To send order updates, shipping confirmations, and customer support responses.",
        "To personalize your shopping experience and recommend products.",
        "To prevent fraud and secure our platform.",
        "To send promotional emails (only with your consent).",
      ],
    },
    {
      title: "3. Information Sharing",
      content: [
        "We **do not sell** your personal information to third parties.",
        "We share information only with: shipping carriers, payment processors, and analytics providers.",
        "We may disclose information if required by law or to protect our rights.",
      ],
    },
    {
      title: "4. Cookies & Tracking",
      content: [
        "We use cookies to keep you logged in and remember your cart.",
        "Analytics cookies help us understand how you use our site.",
        "You can disable cookies in your browser settings, but some features may not work.",
      ],
    },
    {
      title: "5. Data Security",
      content: [
        "All data is transmitted using 256-bit SSL encryption.",
        "Payment information is processed by PCI-DSS certified providers.",
        "We never store full credit card numbers on our servers.",
      ],
    },
    {
      title: "6. Your Rights",
      content: [
        "You have the right to access, correct, or delete your personal data.",
        "You can opt out of marketing emails at any time.",
        "You can request a copy of your data by contacting us.",
      ],
    },
    {
      title: "7. Children's Privacy",
      content: [
        "Our services are not directed to children under 13.",
        "We do not knowingly collect information from children under 13.",
      ],
    },
    {
      title: "8. Changes to This Policy",
      content: [
        "We may update this policy from time to time.",
        "Material changes will be notified via email or site notification.",
      ],
    },
    {
      title: "9. Contact Us",
      content: [
        "Email: privacy@shophub.com",
        "Phone: +855 12 345 678",
        "Address: 123 Main Street, Phnom Penh, Cambodia",
      ],
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
            Privacy Policy
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
          At ShopHub, we take your privacy seriously. This policy explains what
          information we collect, how we use it, and the choices you have.
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
              <ul className="space-y-2">
                {section.content.map((line, j) => (
                  <li
                    key={j}
                    className="text-gray-600 dark:text-gray-400 leading-relaxed pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500"
                    dangerouslySetInnerHTML={{
                      __html: line.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-gray-900 dark:text-white">$1</strong>',
                      ),
                    }}
                  />
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
