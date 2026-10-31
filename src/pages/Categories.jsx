import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shirt,
  Footprints,
  Watch,
  Home as HomeIcon,
  Sparkles,
  Dumbbell,
  BookOpen,
  Smartphone,
  Tag,
  ArrowRight,
  Package,
  Loader2,
} from "lucide-react";
import { categoryApi } from "../api/category";

// ============ LOCAL PRESENTATION MAP ============
// DB stores only name + description. We enrich with icon/image/color here.
const CATEGORY_PRESENTATION = {
  Women: {
    Icon: Shirt,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop",
    color: "from-pink-500 to-rose-600",
  },
  Men: {
    Icon: Shirt,
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&auto=format&fit=crop",
    color: "from-slate-600 to-gray-800",
  },
  Beauty: {
    Icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop",
    color: "from-rose-500 to-pink-600",
  },
  Kids: {
    Icon: Smartphone,
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop",
    color: "from-amber-400 to-orange-500",
  },
  Lifestyle: {
    Icon: HomeIcon,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop",
    color: "from-teal-500 to-cyan-600",
  },
  Fashion: {
    Icon: Shirt,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop",
    color: "from-fuchsia-500 to-purple-600",
  },
  News: {
    Icon: BookOpen,
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop",
    color: "from-blue-500 to-indigo-600",
  },
  Shoes: {
    Icon: Footprints,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
    color: "from-orange-500 to-red-600",
  },
  Accessories: {
    Icon: Watch,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop",
    color: "from-purple-500 to-fuchsia-600",
  },
  Home: {
    Icon: HomeIcon,
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop",
    color: "from-emerald-500 to-teal-600",
  },
  Sports: {
    Icon: Dumbbell,
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop",
    color: "from-cyan-500 to-blue-600",
  },
};

// Fallback if a category isn't in the map
const FALLBACK = {
  Icon: Package,
  image:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop",
  color: "from-gray-500 to-gray-700",
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryApi.getAll();
        const payload = res.data.data;
        const list = Array.isArray(payload) ? payload : payload?.content || [];
        setCategories(list);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* HERO with background image */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&auto=format&fit=crop"
          alt="Shop by category banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        {/* Subtle blue tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-indigo-600/30 mix-blend-multiply" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-4"
          >
            <Tag className="w-3.5 h-3.5" />
            All Categories
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
          >
            Browse by Category
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/95 max-w-2xl mx-auto drop-shadow"
          >
            Explore our complete collection of products across every category
          </motion.p>
        </div>
      </section>
      {/* GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-600" />
            <p>Loading categories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No categories yet</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {categories.map((cat) => {
              const presentation = CATEGORY_PRESENTATION[cat.name] || FALLBACK;
              const Icon = presentation.Icon;
              const productCount = cat.productCount || 0;

              return (
                <motion.div
                  key={cat.id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="group block relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow"
                  >
                    <img
                      src={presentation.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="relative h-full flex flex-col justify-end p-4 lg:p-5 text-white">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${presentation.color} flex items-center justify-center mb-3 shadow-lg`}
                      >
                        <Icon
                          className="w-6 h-6 text-white"
                          strokeWidth={2.5}
                        />
                      </motion.div>

                      <h3 className="font-bold text-base lg:text-lg mb-0.5">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-white/80 mb-2">
                        {productCount} product{productCount !== 1 ? "s" : ""}
                      </p>

                      <div className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Shop now
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </div>
  );
}
