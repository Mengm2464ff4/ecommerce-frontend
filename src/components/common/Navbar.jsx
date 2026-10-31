import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Search,
  ShoppingCart,
  Store,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Package,
  Heart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import ThemeToggle from "./ThemeToggle";


// ============ MENU ITEMS ============
const MENU_ITEMS = [
  { label: "HOME", to: "/" },
  {
    label: "WOMEN",
    to: "/products?category=Women",
    children: [
      { label: "Dresses", to: "/products?category=Women&subcategory=Dresses" },
      { label: "Tops", to: "/products?category=Women&subcategory=Tops" },
      { label: "Skirts", to: "/products?category=Women&subcategory=Skirts" },
      { label: "Handbags", to: "/products?category=Women&subcategory=Bags" },
      { label: "Heels", to: "/products?category=Women&subcategory=Heels" },
      { label: "Jewelry", to: "/products?category=Women&subcategory=Jewelry" },
      { label: "New Arrivals", to: "/products?category=Women" },
    ],
  },
  {
    label: "MEN",
    to: "/products?category=Men",
    children: [
      { label: "T-Shirts", to: "/products?category=Men&subcategory=T-Shirts" },
      { label: "Shirts", to: "/products?category=Men&subcategory=Shirts" },
      { label: "Jeans", to: "/products?category=Men&subcategory=Jeans" },
      { label: "Jackets", to: "/products?category=Men&subcategory=Jackets" },
      { label: "Shoes", to: "/products?category=Men&subcategory=Shoes" },
      { label: "Watches", to: "/products?category=Men&subcategory=Watches" },
      { label: "New Arrivals", to: "/products?category=Men" },
    ],
  },
  {
    label: "BEAUTY",
    to: "/products?category=Beauty",
    children: [
      {
        label: "Skincare",
        to: "/products?category=Beauty&subcategory=Skincare",
      },
      { label: "Makeup", to: "/products?category=Beauty&subcategory=Makeup" },
      {
        label: "Fragrance",
        to: "/products?category=Beauty&subcategory=Fragrance",
      },
      {
        label: "Hair Care",
        to: "/products?category=Beauty&subcategory=Hair%20Care",
      },
      {
        label: "Bath & Body",
        to: "/products?category=Beauty&subcategory=Bath%20%26%20Body",
      },
    ],
  },
  {
    label: "KIDS",
    to: "/products?category=Kids",
    children: [
      { label: "Baby (0–2y)", to: "/products?category=Kids&subcategory=Baby" },
      {
        label: "Toddler (2–5y)",
        to: "/products?category=Kids&subcategory=Toddler",
      },
      { label: "Kids (5–12y)", to: "/products?category=Kids&subcategory=Kids" },
      { label: "Toys & Games", to: "/products?category=Kids&subcategory=Toys" },
    ],
  },
  {
    label: "LIFESTYLE",
    to: "/products?category=Lifestyle",
    children: [
      {
        label: "Home & Living",
        to: "/products?category=Lifestyle&subcategory=Home",
      },
      {
        label: "Kitchen & Dining",
        to: "/products?category=Lifestyle&subcategory=Kitchen",
      },
      {
        label: "Travel & Outdoor",
        to: "/products?category=Lifestyle&subcategory=Travel",
      },
      {
        label: "Stationery",
        to: "/products?category=Lifestyle&subcategory=Stationery",
      },
      {
        label: "Toys & Collectibles",
        to: "/products?category=Lifestyle&subcategory=Collectibles",
      },
    ],
  },
  {
    label: "FASHION",
    to: "/products?category=Fashion",
    children: [
      { label: "New Arrivals", to: "/products?category=Fashion" },
      { label: "Best Sellers", to: "/products?category=Fashion" },
      {
        label: "Street Style",
        to: "/products?category=Fashion&subcategory=Street",
      },
      { label: "Casual", to: "/products?category=Fashion&subcategory=Casual" },
      {
        label: "T-Shirts & Tops",
        to: "/products?category=Fashion&subcategory=T-Shirts",
      },
      {
        label: "Dresses",
        to: "/products?category=Fashion&subcategory=Dresses",
      },
      {
        label: "Jeans & Trousers",
        to: "/products?category=Fashion&subcategory=Jeans",
      },
      {
        label: "Jackets & Coats",
        to: "/products?category=Fashion&subcategory=Jackets",
      },
      {
        label: "Hoodies & Sweats",
        to: "/products?category=Fashion&subcategory=Hoodies",
      },
      {
        label: "Activewear",
        to: "/products?category=Fashion&subcategory=Activewear",
      },
    ],
  },
  {
    label: "NEWS",
    to: "/products?category=News",
    children: [
      { label: "Clothing", to: "/products?category=News&subcategory=Clothing" },
      {
        label: "Accessories",
        to: "/products?category=News&subcategory=Accessories",
      },
      { label: "Shoes", to: "/products?category=News&subcategory=Shoes" },
      { label: "Beauty", to: "/products?category=News&subcategory=Beauty" },
      { label: "Sports", to: "/products?category=News&subcategory=Sports" },
      { label: "Home", to: "/products?category=News&subcategory=Home" },
    ],
  },
  { label: "SALE", to: "/deals", highlight: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
 

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const isActive = (item) => {
    if (item.to === "/") return location.pathname === "/";
    return location.pathname.startsWith(item.to.split("?")[0]);
  };

  const toggleExpand = (label) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  const closeDrawer = () => {
    setMobileOpen(false);
    setExpandedItem(null);
  };


  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white transition-colors"
      >
        {/* ============ ROW 1: LOGO + SEARCH + ICONS ============ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            <div className="flex items-center gap-3 flex-shrink-0">
              <motion.button
                onClick={() => setMobileOpen(true)}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/"
                  className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400 transition"
                >
                  {/* 🔧 FIX: Hide logo image on mobile, show on sm+ */}
                  <img
                    src="/logo/logo.png"
                    alt="ShopHub"
                    className="hidden sm:block h-24 w-auto object-contain"
                  />
                  {/* 🔧 FIX: Text fallback visible only on mobile */}
                  <span className="sm:hidden text-xl font-bold text-blue-600 dark:text-blue-400">
                    ShopHub
                  </span>
                </Link>
              </motion.div>
            </div>

            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl"
            >
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-24 py-2.5 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-800 transition text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center gap-1 flex-shrink-0">
              <motion.button
                onClick={() => setSearchOpen(true)}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <ThemeToggle />

              {user && (
                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition block"
                  title="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        key={itemCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-medium shadow-lg"
                      >
                        {itemCount > 99 ? "99+" : itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}

              {user ? (
                <div className="relative hidden md:block">
                  <motion.button
                    onClick={() => setAccountOpen(!accountOpen)}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {(user.username?.[0] || "U").toUpperCase()}
                    </div>
                    <span className="max-w-[80px] truncate">
                      {user.username}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        accountOpen ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  {accountOpen && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAccountOpen(false)}
                    />
                  )}

                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl py-2 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"  
                          >
                            <UserIcon className="w-4 h-4" /> My Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          >
                            <Package className="w-4 h-4" />
                            My Orders
                          </Link>

                          <Link
                            to="/wishlist"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          >
                            <Heart className="w-4 h-4" />
                            Wishlist
                          </Link>
                        </div>

                        {user?.role === "ADMIN" && (
                          <>
                            <div className="border-t border-gray-100 dark:border-gray-800" />
                            <div className="py-1">
                              <Link
                                to="/admin"
                                onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition"
                              >
                                <LayoutDashboard className="w-4 h-4" />
                                Admin Dashboard
                              </Link>
                            </div>
                          </>
                        )}

                        <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setAccountOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1">
                  <Link
                    to="/login"
                    className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm shadow-blue-500/30"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============ ROW 2: MENU (desktop) ============ */}
        <div className="hidden md:block border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-1 h-12 overflow-x-auto scrollbar-hide">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`group relative px-4 py-2 text-sm font-semibold tracking-wide transition-colors whitespace-nowrap ${
                    item.highlight
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100 ${
                      item.highlight ? "bg-red-500" : "bg-blue-500"
                    }`}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ============ MOBILE SEARCH OVERLAY ============ */}
      {createPortal(
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
              onClick={() => setSearchOpen(false)}
            >
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                exit={{ y: -50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 p-4 shadow-2xl"
              >
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-3 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* ============ MOBILE DRAWER ============ */}
      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeDrawer}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
              />

              <motion.div
                key="drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="md:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-[1000] shadow-2xl overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                  <Link
                    to="/"
                    onClick={closeDrawer}
                    className="flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400"
                  >
                    {/* 🔧 FIX: Show text in mobile drawer instead of large logo */}
                    <span className="text-xl font-bold">ShopHub</span>
                  </Link>
                  <button
                    onClick={closeDrawer}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {user && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <Link
                      to="/profile"
                      onClick={closeDrawer}
                      className="flex items-center gap-3 w-full text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                        {(user.username?.[0] || "U").toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}

                <div className="p-3 space-y-1">
                  <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Shop
                  </p>

                  {MENU_ITEMS.map((item) => {
                    const active = isActive(item);
                    const hasChildren = !!item.children;
                    const isExpanded = expandedItem === item.label;

                    if (!hasChildren) {
                      return (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={closeDrawer}
                          className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition ${
                            item.highlight
                              ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                              : active
                                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    }

                    return (
                      <div key={item.label}>
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition ${
                            isExpanded
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
                              : active
                                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pl-3 pt-1 pb-2 space-y-0.5 border-l-2 border-blue-100 dark:border-blue-500/20 ml-5">
                                <Link
                                  to={item.to}
                                  onClick={closeDrawer}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                                >
                                  Shop All {item.label}
                                  <ChevronRight className="w-3 h-3" />
                                </Link>

                                {item.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    to={child.to}
                                    onClick={closeDrawer}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-1">
                  <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Account
                  </p>

                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={closeDrawer}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={closeDrawer}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>

                      {user?.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          onClick={closeDrawer}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={closeDrawer}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <UserIcon className="w-4 h-4" />
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeDrawer}
                        className="block px-3 py-3 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition text-center mt-2"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
