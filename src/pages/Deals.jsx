import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Clock,
  TrendingDown,
  Tag,
  Flame,
  Gift,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Percent,
  Sparkles,
  Loader2,
  Package,
} from "lucide-react";

// ============ FALLBACK SAMPLE (used only if DB is empty) ============
const SAMPLE_DEALS = [
  {
    id: 1,
    name: "Wireless Headphones",
    originalPrice: 299.99,
    salePrice: 179.99,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
    slideImage:
      "https://images.unsplash.com/photo-1511376777868-611b54f68947?w=1200&auto=format&fit=crop",
    badge: "Hot Deal",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    originalPrice: 249.99,
    salePrice: 149.99,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
    slideImage:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop",
    badge: "Best Seller",
  },
  {
    id: 3,
    name: "Running Sneakers",
    originalPrice: 129.99,
    salePrice: 79.99,
    discount: 38,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
    slideImage:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&auto=format&fit=crop",
    badge: "Trending",
  },
  {
    id: 4,
    name: "Leather Backpack",
    originalPrice: 189.99,
    salePrice: 99.99,
    discount: 47,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop",
    slideImage:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&auto=format&fit=crop",
    badge: "Hot Deal",
  },
];

// ============ CATEGORY → LIFESTYLE BACKGROUND IMAGES ============
// Different from the product's own image — used only for the flash slides.
const CATEGORY_SLIDE_IMAGES = {
  Women: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop",
  ],
  Men: [
    "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1600&auto=format&fit=crop",
  ],
  Beauty: [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&auto=format&fit=crop",
  ],
  Kids: [
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1600&auto=format&fit=crop",
  ],
  Lifestyle: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&auto=format&fit=crop",
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600&auto=format&fit=crop",
  ],
  News: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&auto=format&fit=crop",
  ],
  Shoes: [
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&auto=format&fit=crop",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1600&auto=format&fit=crop",
  ],
  Home: [
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1600&auto=format&fit=crop",
  ],
  Sports: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&auto=format&fit=crop",
  ],
};

const FALLBACK_SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop",
];

const getSlideImage = (product, index) => {
  const list = CATEGORY_SLIDE_IMAGES[product.categoryName];
  if (list && list.length > 0) {
    return list[index % list.length];
  }
  return FALLBACK_SLIDE_IMAGES[index % FALLBACK_SLIDE_IMAGES.length];
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ============ COUNTDOWN ============
const getTimeLeft = (end) => {
  const diff = Math.max(0, end - Date.now());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
};

const FLASH_ENDS_AT = Date.now() + 24 * 60 * 60 * 1000;

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [flashIndex, setFlashIndex] = useState(0);
  const [flashPaused, setFlashPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(FLASH_ENDS_AT));
  
  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(FLASH_ENDS_AT));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:8080/api/products/active?page=0&size=24",
        );
        if (res.ok) {
          const data = await res.json();
          const content = data.data?.content || data.data || [];

          const transformed = content.map((p, i) => {
            const salePrice = Number(p.price);
            const discountPercent = [20, 30, 40, 25, 35, 45][i % 6];
            const originalPrice = Number(
              (salePrice / (1 - discountPercent / 100)).toFixed(2),
            );
            const badges = [
              "Hot Deal",
              "Best Seller",
              "Trending",
              "Limited",
              "Popular",
              "Flash Sale",
            ];

            // Card image = the product's actual image
            const cardImage = p.imageUrl
              ? `http://localhost:8080${p.imageUrl}`
              : "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop";

            // Slide image = a different, category-based lifestyle image
            const slideImage = getSlideImage(p, i);

            return {
              id: p.id,
              name: p.name,
              image: cardImage,
              slideImage,
              originalPrice,
              salePrice,
              discount: discountPercent,
              badge: badges[i % badges.length],
              description: p.description,
              stock: p.stock,
              category: p.categoryName,
            };
          });

          setDeals(transformed);
        }
      } catch (err) {
        console.error("Failed to load deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const displayDeals = deals.length > 0 ? deals : SAMPLE_DEALS;

  const flashDeals = displayDeals.slice(0, 5);
  const totalFlash = flashDeals.length;

  // Auto-slide
  useEffect(() => {
    if (flashPaused || totalFlash === 0) return;
    const timer = setInterval(() => {
      setFlashIndex((prev) => (prev + 1) % totalFlash);
    }, 5000);
    return () => clearInterval(timer);
  }, [flashPaused, totalFlash]);

  const nextFlash = () => setFlashIndex((prev) => (prev + 1) % totalFlash);
  const prevFlash = () =>
    setFlashIndex((prev) => (prev - 1 + totalFlash) % totalFlash);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) nextFlash();
    else prevFlash();
  };
  
  const pauseTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
     // Cancel any pending resume
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      setFlashPaused(true);
};

  const handleMouseLeave = () => {
    // Resume after 2 seconds of leaving
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setFlashPaused(false);
    }, 2000);
  };
useEffect(() => {
  return () => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };
}, []);

  const currentFlash = flashDeals[flashIndex];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* HERO */}
      {/* HERO with background image */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://i.pinimg.com/736x/cc/8a/f7/cc8af7358a239feac43b4f516f75be08.jpg"
          alt="Deals banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />

        {/* Subtle red tint for "deal" vibe */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-transparent to-orange-600/30 mix-blend-multiply" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-4"
          >
            <Flame className="w-3.5 h-3.5" />
            Limited Time Offers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
          >
            Today's Best Deals
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/95 max-w-2xl mx-auto mb-8 drop-shadow"
          >
            Save up to 50% on trending products. New deals added daily.
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4"
          >
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Ends in:</span>
            <div className="flex gap-2">
              {[
                { value: timeLeft.hours, label: "h" },
                { value: timeLeft.minutes, label: "m" },
                { value: timeLeft.seconds, label: "s" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white text-gray-900 rounded-lg px-3 py-1.5 font-bold min-w-[52px] text-center"
                >
                  {String(value).padStart(2, "0")}
                  <span className="text-xs text-gray-500 ml-0.5">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FLASH DEAL CAROUSEL ============ */}
      {loading ? (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="rounded-3xl bg-gray-100 dark:bg-gray-900 h-[400px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
          </div>
        </section>
      ) : currentFlash ? (
        <section
          className="max-w-7xl mx-auto px-4 py-12"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={flashIndex}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="relative h-[400px] sm:h-[440px] md:h-[480px] lg:h-[520px]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Background image — category-based, not the product image */}
                <img
                  src={currentFlash.slideImage}
                  alt={currentFlash.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&auto=format&fit=crop";
                  }}
                />

                {/* Dark gradient — text readable on left, image visible on right */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />

                {/* Subtle red/orange "deal" tint */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-orange-600/20 to-transparent mix-blend-multiply" />

                {/* Content */}
                <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center">
                  <div className="max-w-2xl text-white">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-4">
                      <Zap className="w-3.5 h-3.5" />
                      Flash Deal
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight drop-shadow-lg">
                      {currentFlash.name}
                    </h2>

                    {currentFlash.description && (
                      <p className="text-base sm:text-lg text-white/90 mb-4 line-clamp-2 max-w-lg drop-shadow">
                        {currentFlash.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                      <span className="text-3xl lg:text-4xl font-bold drop-shadow">
                        ${Number(currentFlash.salePrice).toFixed(2)}
                      </span>
                      <span className="text-lg text-white/70 line-through">
                        ${Number(currentFlash.originalPrice).toFixed(2)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full shadow-lg">
                        <Percent className="w-3.5 h-3.5" />
                        {currentFlash.discount}% OFF
                      </span>
                    </div>

                    <Link
                      to={`/products/${currentFlash.id}`}
                      className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-medium transition shadow-xl"
                    >
                      Grab this deal
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Prev — hidden on mobile */}
            <motion.button
              onClick={prevFlash}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.9 }}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 text-white items-center justify-center shadow-lg z-10 transition"
              aria-label="Previous deal"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Next — hidden on mobile */}
            <motion.button
              onClick={nextFlash}
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.9 }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 text-white items-center justify-center shadow-lg z-10 transition"
              aria-label="Next deal"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {flashDeals.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFlashIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === flashIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to deal ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ DEALS GRID ============ */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            More Deals
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {loading
              ? "Loading deals..."
              : `${displayDeals.length} products on sale`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : displayDeals.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No deals available yet
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            {displayDeals.map((deal) => (
              <motion.div
                key={deal.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to={`/products/${deal.id}`}
                  className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop";
                      }}
                    />

                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-500 text-white shadow-lg">
                      <Flame className="w-3 h-3" />
                      {deal.badge}
                    </span>

                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900 shadow-lg">
                      -{deal.discount}%
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {deal.name}
                    </h3>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        ${Number(deal.salePrice).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${Number(deal.originalPrice).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <TrendingDown className="w-3 h-3" />
                      You save $
                      {Number(deal.originalPrice - deal.salePrice).toFixed(2)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* PROMO STRIP — image cards */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-4 lg:gap-6"
        >
          {[
            {
              title: "Free Gift",
              subtitle: "On orders over $100",
              image:
                "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop",
              badge: "Bonus",
              link: "/products",
            },
            {
              title: "Extra 10% Off",
              subtitle: "Use code SAVE10 at checkout",
              image:
                "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop",
              badge: "Code",
              link: "/products",
            },
            {
              title: "New Arrivals",
              subtitle: "Fresh products every week",
              image:
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop",
              badge: "Just In",
              link: "/products?sort=new",
            },
          ].map((promo, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={promo.link}
                className="group block relative overflow-hidden rounded-2xl h-56 sm:h-64 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Background image */}
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-5 text-white">
                  {/* Badge */}
                  <span className="inline-flex w-fit items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/30 mb-3">
                    {promo.badge}
                  </span>

                  <h3 className="text-2xl font-bold mb-1 drop-shadow-lg">
                    {promo.title}
                  </h3>

                  <p className="text-sm text-white/85 mb-3 drop-shadow">
                    {promo.subtitle}
                  </p>

                  <div className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
