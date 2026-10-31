import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  TrendingUp,
  Zap,
  Tag,
  Package,
  Shirt,
  Footprints,
  Watch,
  Home as HomeIcon,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Smartphone,
  Sun,
  ShoppingBag,
} from "lucide-react";
import { getProductBadge, getProductDiscount } from "../utils/productBadges";
import ProductCard from "../components/products/ProductCard";
import { productApi } from "../api/product";

// ============ HERO SLIDES ============
const HERO_SLIDES = [
  {
    id: 1,
    badge: "New Arrivals",
    title: "Fashion That Speaks For You",
    subtitle:
      "Discover the latest trends in clothing, shoes and accessories. Free shipping on orders over $50.",
    cta: "Shop Fashion",
    ctaLink: "/products?category=Fashion",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop",
    alt: "Fashion banner",
    Icon: Shirt,
  },
  {
    id: 2,
    badge: "Limited Time",
    title: "Shoes Sale — Up to 50% Off",
    subtitle:
      "Step up your style with sneakers, running shoes, boots and more.",
    cta: "Shop Shoes",
    ctaLink: "/products?category=Shoes",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&auto=format&fit=crop",
    alt: "Shoes banner",
    Icon: Footprints,
  },
  {
    id: 3,
    badge: "Best Sellers",
    title: "Beauty Essentials You'll Love",
    subtitle: "Skincare, makeup, fragrance and hair care — all in one place.",
    cta: "Shop Beauty",
    ctaLink: "/products?category=Beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&auto=format&fit=crop",
    alt: "Beauty banner",
    Icon: Sparkles,
  },
  {
    id: 4,
    badge: "Trending Now",
    title: "Refresh Your Everyday Style",
    subtitle:
      "Explore men's and women's collections — new arrivals every week.",
    cta: "Shop Women",
    ctaLink: "/products?category=Women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&auto=format&fit=crop",
    alt: "Women's collection banner",
    Icon: ShoppingBag,
  },
];

// ============ FEATURES ============
const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day money back",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% protected",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
  },
];

// ============ HOME PRODUCTS ============
const HOME_PRODUCTS = [
  {
    id: 1,
    label: "New In",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop",
    link: "/products?sort=new",
  },
  {
    id: 2,
    label: "Dresses",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop",
    link: "/products?subcategory=Dresses",
  },
  {
    id: 3,
    label: "Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
    link: "/products?category=Shoes",
  },
  {
    id: 4,
    label: "Beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop",
    link: "/products?category=Beauty",
  },
  {
    id: 5,
    label: "Watches",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop",
    link: "/products?search=watch",
  },
  {
    id: 6,
    label: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop",
    link: "/products?search=bag",
  },
  {
    id: 7,
    label: "Sale",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop",
    link: "/products?category=Fashion",
  },
  {
    id: 8,
    label: "Men",
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&auto=format&fit=crop",
    link: "/products?category=Men",
  },
];

// ============ PROMOS ============
const PROMOS = [
  {
    id: 1,
    badge: "Members Only",
    title: "Free Shipping on Orders $50+",
    description: "Join ShopHub+ and get free 2-day shipping on every order.",
    cta: "Join Now",
    link: "/register",
    bg: "from-blue-600 to-indigo-700",
    Icon: Truck,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    badge: "Save Big",
    title: "Up to 50% Off Select Items",
    description: "Fashion, beauty, home and more — new markdowns added daily.",
    cta: "Shop Sale",
    link: "/products",
    bg: "from-pink-600 to-purple-700",
    Icon: Tag,
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    badge: "New Season",
    title: "Refresh Your Wardrobe",
    description: "Explore new arrivals in fashion, shoes and accessories.",
    cta: "Shop Fashion",
    link: "/products?category=Fashion",
    bg: "from-emerald-600 to-teal-700",
    Icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop",
  },
];

// ============ MOTION ============
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};



export default function Home() {
  // Hero state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  // Featured products
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Hero mobile refs
  const mobileScrollRef = useRef(null);
  const userSwiping = useRef(false);
  const isJumping = useRef(false);
  const resumeTimeout = useRef(null);
  const scrollTimeout = useRef(null);
  const autoScrollRaf = useRef(null);

  // Promo carousel state
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoPaused, setPromoPaused] = useState(false);
  const promoResumeTimer = useRef(null);
  const promoTouchStartX = useRef(0);
  const promoTouchEndX = useRef(0);

  const n = HERO_SLIDES.length;

  const extendedSlides = [
    HERO_SLIDES[n - 1],
    ...HERO_SLIDES,
    ...HERO_SLIDES,
    HERO_SLIDES[0],
  ];


    // ============ FETCH FEATURED PRODUCTS ============
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingProducts(true);
        const res = await productApi.getActive(0, 8);
        const content = res.data?.data?.content || res.data?.data || [];
        setFeaturedProducts(content.slice(0, 8));
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchFeatured();
  }, []);


  // ============ SMOOTH SCROLL HELPER ============
  const smoothScrollTo = useCallback((el, targetX, duration = 850) => {
    if (autoScrollRaf.current) {
      cancelAnimationFrame(autoScrollRaf.current);
      autoScrollRaf.current = null;
    }

    const startX = el.scrollLeft;
    const distance = targetX - startX;
    if (Math.abs(distance) < 2) return;

    const startTime = performance.now();
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      el.scrollLeft = startX + distance * eased;

      if (progress < 1) {
        autoScrollRaf.current = requestAnimationFrame(step);
      } else {
        autoScrollRaf.current = null;
      }
    };

    autoScrollRaf.current = requestAnimationFrame(step);
  }, []);

  // ============ HERO INITIAL POSITION ============
  useEffect(() => {
    const goToStart = () => {
      const el = mobileScrollRef.current;
      if (!el || window.innerWidth >= 768) return;
      el.scrollLeft = el.clientWidth;
    };
    goToStart();
    const t = setTimeout(goToStart, 120);
    return () => clearTimeout(t);
  }, []);

  // ============ HERO AUTO-SLIDE ============
  useEffect(() => {
    const timer = setInterval(() => {
      if (paused || userSwiping.current || isJumping.current) return;

      setDirection(1);
      setCurrentSlide((prev) => {
        const next = (prev + 1) % n;

        if (window.innerWidth < 768 && mobileScrollRef.current) {
          const el = mobileScrollRef.current;
          const width = el.clientWidth;
          const currentIndex = Math.round(el.scrollLeft / width);
          smoothScrollTo(el, (currentIndex + 1) * width, 900);
        }

        return next;
      });
    }, 5500);

    return () => clearInterval(timer);
  }, [paused, n, smoothScrollTo]);

  // ============ FETCH FEATURED PRODUCTS ============
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch(
          "http://localhost:8080/api/products/active?page=0&size=8",
        );
        if (res.ok) {
          const data = await res.json();
          const content = data.data?.content || data.data || [];
          setFeaturedProducts(content.slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchFeatured();
  }, []);

  // ============ PROMO AUTO-SLIDE (works on all devices) ============
  useEffect(() => {
    if (promoPaused) return;
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % PROMOS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promoPaused]);

  // ============ PROMO PAUSE BRIEFLY ============
  const pausePromoBriefly = () => {
    setPromoPaused(true);
    if (promoResumeTimer.current) clearTimeout(promoResumeTimer.current);
    promoResumeTimer.current = setTimeout(() => {
      setPromoPaused(false);
    }, 8000);
  };

  const nextPromo = () => {
    setPromoIndex((prev) => (prev + 1) % PROMOS.length);
    pausePromoBriefly();
  };

  const prevPromo = () => {
    setPromoIndex((prev) => (prev - 1 + PROMOS.length) % PROMOS.length);
    pausePromoBriefly();
  };

  // ============ PROMO SWIPE (mobile) ============
  const handlePromoTouchStart = (e) => {
    promoTouchStartX.current = e.touches[0].clientX;
  };

  const handlePromoTouchEnd = (e) => {
    promoTouchEndX.current = e.changedTouches[0].clientX;
    const diff = promoTouchStartX.current - promoTouchEndX.current;

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      nextPromo();
    } else {
      prevPromo();
    }
  };

  // ============ HERO MOBILE SCROLL LOGIC ============
  const getRealIndex = (scrollIndex) => {
    if (scrollIndex <= 0) return n - 1;
    if (scrollIndex >= 2 * n + 1) return 0;
    return (scrollIndex - 1) % n;
  };

  const handleMobileScroll = () => {
    if (isJumping.current) return;
    const el = mobileScrollRef.current;
    if (!el) return;
    const width = el.clientWidth;
    if (width === 0) return;

    const scrollIndex = Math.round(el.scrollLeft / width);
    const realIndex = getRealIndex(scrollIndex);
    if (realIndex !== currentSlide) setCurrentSlide(realIndex);

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (isJumping.current) return;
      const current = Math.round(el.scrollLeft / width);

      if (current >= n + 1 && current <= 2 * n) {
        isJumping.current = true;
        el.scrollLeft = (current - n) * width;
        requestAnimationFrame(() => {
          isJumping.current = false;
        });
      }
      if (current === 0) {
        isJumping.current = true;
        el.scrollLeft = n * width;
        requestAnimationFrame(() => {
          isJumping.current = false;
        });
      }
    }, 100);
  };

  const handleTouchStart = () => {
    userSwiping.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    if (autoScrollRaf.current) {
      cancelAnimationFrame(autoScrollRaf.current);
      autoScrollRaf.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      userSwiping.current = false;
    }, 6000);
  };

  // ============ HERO DESKTOP HANDLERS ============
  const pauseBriefly = () => {
    setPaused(true);
    setTimeout(() => setPaused(false), 8000);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % n);
    pauseBriefly();
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + n) % n);
    pauseBriefly();
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    pauseBriefly();

    if (window.innerWidth < 768 && mobileScrollRef.current) {
      const el = mobileScrollRef.current;
      smoothScrollTo(el, (index + 1) * el.clientWidth, 700);
    }
  };

  const slide = HERO_SLIDES[currentSlide];
  const SlideIcon = slide.Icon;

  const promo = PROMOS[promoIndex];
  const PromoIcon = promo.Icon;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* ==================== HERO CAROUSEL ==================== */}
      <section
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="hidden md:block">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 260, damping: 30 },
                opacity: { duration: 0.35 },
              }}
              className="relative min-h-[600px] lg:min-h-[700px] flex items-center"
            >
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </div>

              <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24 w-full">
                <div className="max-w-2xl text-white">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-4"
                  >
                    <SlideIcon className="w-3.5 h-3.5" />
                    {slide.badge}
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-lg"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-white/95 mb-6 drop-shadow"
                  >
                    {slide.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-3 flex-wrap"
                  >
                    <motion.div
                      whileHover={{ y: -3, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        to={slide.ctaLink}
                        className="group inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-medium transition shadow-xl"
                      >
                        {slide.cta}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -3, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white px-6 py-3 rounded-xl font-medium transition"
                      >
                        Browse All
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {HERO_SLIDES.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goToSlide(i)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile hero — swipe carousel with auto-slide */}
        <div className="md:hidden relative">
          <div
            ref={mobileScrollRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollBehavior: "auto",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
              touchAction: "pan-x",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              willChange: "scroll-position",
            }}
          >
            {extendedSlides.map((s, idx) => {
              const Icon = s.Icon;
              return (
                <div
                  key={`${s.id}-${idx}`}
                  className="relative flex-shrink-0 w-full min-h-[500px] flex items-end snap-center"
                  style={{ scrollSnapStop: "always" }}
                >
                  <div className="absolute inset-0">
                    <img
                      src={s.image}
                      alt={s.alt}
                      className="w-full h-full object-cover"
                      draggable={false}
                      loading={idx < 3 ? "eager" : "lazy"}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                  </div>

                  <div className="relative p-6 pb-16 text-white w-full">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-3">
                      <Icon className="w-3.5 h-3.5" />
                      {s.badge}
                    </span>

                    <h1 className="text-3xl font-bold mb-2 leading-tight drop-shadow-lg">
                      {s.title}
                    </h1>

                    <p className="text-sm text-white/90 mb-4 line-clamp-2 drop-shadow">
                      {s.subtitle}
                    </p>

                    <div className="flex gap-2">
                      <Link
                        to={s.ctaLink}
                        className="inline-flex items-center gap-1.5 bg-white text-gray-900 px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg active:scale-95 transition"
                      >
                        {s.cta}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/products"
                        className="inline-flex items-center bg-white/20 backdrop-blur-md border border-white/40 text-white px-4 py-2.5 rounded-xl font-medium text-sm active:scale-95 transition"
                      >
                        Browse
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES BAR ==================== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-default"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {feature.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ==================== BROWSE CATEGORIES ==================== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="text-center mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-2"
          >
            <Tag className="w-4 h-4" />
            Shop by Category
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Find Your Perfect Style
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto"
          >
            From everyday essentials to statement pieces — pick your category
          </motion.p>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => {
              const el = document.getElementById("category-products");
              if (el)
                el.scrollBy({
                  left: -el.clientWidth * 0.8,
                  behavior: "smooth",
                });
            }}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg items-center justify-center active:scale-95 hover:scale-105 transition"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("category-products");
              if (el)
                el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
            }}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg items-center justify-center active:scale-95 hover:scale-105 transition"
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>

          <div
            id="category-products"
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollSnapType: "x mandatory",
            }}
          >
            {HOME_PRODUCTS.map((p) => (
              <Link
                key={p.id}
                to={p.link}
                className="group flex-shrink-0 w-72 sm:w-80 md:w-[22rem] lg:w-[24rem] aspect-[3/4] relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 snap-start"
              >
                <img
                  src={p.image}
                  alt={p.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-base font-bold tracking-wide uppercase">
                    {p.label}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-sm text-white/80 group-hover:text-white transition">
                    Shop now
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => {
                const el = document.getElementById("category-products");
                if (el)
                  el.scrollBy({
                    left: -el.clientWidth * 0.8,
                    behavior: "smooth",
                  });
              }}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center active:scale-90 transition"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Swipe or tap
            </span>
            <button
              onClick={() => {
                const el = document.getElementById("category-products");
                if (el)
                  el.scrollBy({
                    left: el.clientWidth * 0.8,
                    behavior: "smooth",
                  });
              }}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center active:scale-90 transition"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== PROMOS CAROUSEL ==================== */}
      <section
        className="max-w-7xl mx-auto px-4 py-8"
        onMouseEnter={() => setPromoPaused(true)}
        onMouseLeave={() => setPromoPaused(false)}
      >
        <div className="relative overflow-hidden rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={promoIndex}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative h-[320px] sm:h-[380px] md:h-[420px] lg:h-[460px]"
              onTouchStart={handlePromoTouchStart}
              onTouchEnd={handlePromoTouchEnd}
            >
              <img
                src={promo.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${promo.bg} opacity-40 mix-blend-multiply`}
              />

              <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center">
                <div className="max-w-2xl text-white">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-4">
                    <PromoIcon className="w-3.5 h-3.5" />
                    {promo.badge}
                  </span>

                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight drop-shadow-lg">
                    {promo.title}
                  </h3>

                  <p className="text-base sm:text-lg text-white/95 mb-6 max-w-lg drop-shadow">
                    {promo.description}
                  </p>

                  <motion.div
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block"
                  >
                    <Link
                      to={promo.link}
                      className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition shadow-xl"
                    >
                      {promo.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>

              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="hidden md:block absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
              >
                <PromoIcon
                  className="w-40 h-40 lg:w-56 lg:h-56"
                  strokeWidth={1}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Prev — hidden on mobile */}
          <motion.button
            onClick={prevPromo}
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.9 }}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 text-white items-center justify-center shadow-lg z-10 transition"
            aria-label="Previous promo"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Next — hidden on mobile */}
          <motion.button
            onClick={nextPromo}
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.9 }}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 text-white items-center justify-center shadow-lg z-10 transition"
            aria-label="Next promo"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Dots — always visible */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {PROMOS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setPromoIndex(i);
                  pausePromoBriefly();
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === promoIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to promo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-2"
            >
              <TrendingUp className="w-4 h-4" />
              Hand-picked for you
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
            >
              Featured Products
            </motion.h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No products available yet
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {featuredProducts.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-64 h-64 bg-blue-500/30 rounded-full -mr-32 -mt-32 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full -ml-32 -mb-32 blur-3xl"
          />

          <div className="relative max-w-2xl mx-auto">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Get 10% Off Your First Order
            </h2>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for exclusive deals, new arrivals, and
              insider tips.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition shadow-lg shadow-blue-500/30 whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>

            <p className="text-xs text-gray-500 mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
