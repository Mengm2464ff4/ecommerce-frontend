import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Store,
  Users,
  Award,
  Truck,
  ShieldCheck,
  Heart,
  Sparkles,
  ArrowRight,
  Package,
  Globe,
  TrendingUp,
  Star,
  Quote,
  Leaf,
  Zap,
  MapPin,
} from "lucide-react";

// ============ DATA ============
const STATS = [
  {
    value: "50K+",
    label: "Happy Customers",
    Icon: Users,
    color: "text-blue-500",
  },
  {
    value: "10K+",
    label: "Products Sold",
    Icon: Package,
    color: "text-emerald-500",
  },
  {
    value: "120+",
    label: "Countries Served",
    Icon: Globe,
    color: "text-purple-500",
  },
  {
    value: "4.9★",
    label: "Customer Rating",
    Icon: Star,
    color: "text-amber-500",
  },
];

const VALUES = [
  {
    Icon: Truck,
    title: "Free Fast Shipping",
    description: "Delivered to your door in 2–5 days. Free on orders over $50.",
    bg: "bg-blue-600",
  },
  {
    Icon: ShieldCheck,
    title: "Secure Payments",
    description: "Bank-level encryption. We never store your card details.",
    bg: "bg-emerald-600",
  },
  {
    Icon: Heart,
    title: "Customer Obsessed",
    description: "24/7 human support. 30-day hassle-free returns.",
    bg: "bg-pink-600",
  },
  {
    Icon: Award,
    title: "Curated Quality",
    description: "Every product hand-tested. If it's not great, we drop it.",
    bg: "bg-purple-600",
  },
];

const MILESTONES = [
  { year: "2020", title: "Founded", desc: "Started in a tiny apartment." },
  { year: "2021", title: "1,000 Customers", desc: "Our first big milestone." },
  { year: "2023", title: "Went Global", desc: "Shipping to 120+ countries." },
  { year: "2026", title: "50K+ Customers", desc: "Still growing every day." },
];

const TEAM = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    initials: "AC",
    bg: "bg-blue-600",
  },
  {
    name: "Sara Williams",
    role: "Head of Product",
    initials: "SW",
    bg: "bg-pink-600",
  },
  {
    name: "Marcus Lee",
    role: "Lead Engineer",
    initials: "ML",
    bg: "bg-emerald-600",
  },
  {
    name: "Priya Patel",
    role: "Customer Success",
    initials: "PP",
    bg: "bg-purple-600",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Best online shopping experience I've had. Fast delivery, real support, and the products actually match the photos.",
    name: "Dara Kim",
    role: "Verified Buyer",
  },
  {
    quote:
      "I've ordered 12 times already. Never once had an issue. ShopHub is my go-to.",
    name: "Sophea Chan",
    role: "Loyal Customer",
  },
  {
    quote: "Returns are actually easy. That's rare. Won me over instantly.",
    name: "Vichea Ly",
    role: "Verified Buyer",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-indigo-700 dark:bg-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-medium mb-6"
              >
                <Sparkles className="w-3.5 h-3.5" />
                About ShopHub
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                Shopping,
                <br />
                <span className="text-yellow-300">reimagined.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-white/85 mb-8 max-w-lg leading-relaxed"
              >
                We're on a mission to make online shopping genuinely enjoyable —
                no tricks, no sketchy vendors, just great products delivered
                fast.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition shadow-xl hover:-translate-y-0.5"
                >
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/25 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop"
                  alt="Shopping"
                  className="rounded-3xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        +240%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Growth since 2023
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {STATS.map(({ value, label, Icon, color }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-1 transition"
            >
              <Icon className={`w-7 h-7 mx-auto mb-3 ${color}`} />
              <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {value}
              </p>
              <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============ MISSION ============ */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
              <Store className="w-4 h-4" />
              Our Mission
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Built for shoppers who expect more
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                We started ShopHub in 2020 because online shopping had a
                problem: too much noise, too little trust, and shipping that
                felt like a gamble.
              </p>
              <p>
                So we built the opposite. Hand-picked products. Transparent
                pricing. Support you can actually reach. And delivery that
                arrives when we say it will.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { Icon: Zap, label: "Fast Delivery" },
                { Icon: Leaf, label: "Sustainable" },
                { Icon: MapPin, label: "Global Reach" },
              ].map(({ Icon, label }) => (
                <div key={label} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <img
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&auto=format&fit=crop"
              alt=""
              className="rounded-2xl shadow-lg col-span-2 h-56 w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop"
              alt=""
              className="rounded-2xl shadow-lg h-40 w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop"
              alt=""
              className="rounded-2xl shadow-lg h-40 w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <section className="bg-gray-50 dark:bg-gray-900/60 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-3"
            >
              What we stand for
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Four things we never compromise on
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {VALUES.map(({ Icon, title, description, bg }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-transparent hover:shadow-2xl transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ TIMELINE ============ */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            How we got here
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Six years. Thousands of orders. One obsession — making shopping
            better.
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-6 left-[12%] right-[12%] h-0.5 bg-purple-500" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {MILESTONES.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative text-center"
              >
                <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg relative z-10 ring-4 ring-white dark:ring-gray-950">
                  {i + 1}
                </div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {m.year}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  {m.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Loved by shoppers
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 relative"
              >
                <Quote className="w-8 h-8 text-blue-500 mb-4 opacity-40" />
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ TEAM ============ */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            The humans behind the shop
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {TEAM.map((member, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="group text-center"
            >
              <div
                className={`w-24 h-24 mx-auto mb-4 rounded-full ${member.bg} flex items-center justify-center text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform`}
              >
                {member.initials}
              </div>
              <p className="font-bold text-gray-900 dark:text-white">
                {member.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {member.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============ CTA ============ */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-indigo-700 rounded-3xl p-10 lg:p-16 text-center"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Ready to shop smarter?
            </h2>
            <p className="text-white/85 text-lg mb-10 max-w-xl mx-auto">
              Join 50,000+ shoppers who've made ShopHub their go-to store.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition shadow-xl hover:-translate-y-0.5"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/25 text-white px-8 py-4 rounded-xl font-semibold transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
