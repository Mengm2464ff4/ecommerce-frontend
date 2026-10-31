import { Link } from "react-router-dom";
import { Store, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 mt-auto">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* BRAND */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex flex-col mb-4 cursor-pointer">
              <img
                src="/logo/logo.png"
                alt="ShopHub"
                className="h-11 w-auto object-contain pointer-events-none"
              />
              <span className="text-[10px] font-medium tracking-[0.2em] text-blue-400 uppercase mt-1">
                Premium Shopping
              </span>
            </Link>

            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your one-stop shop for fashion, beauty, home and more. Quality
              products at unbeatable prices.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Phnom Penh, Cambodia</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+855 12 345 678</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@shophub.com</span>
              </div>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/products?category=Women"
                  className="hover:text-white transition"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Men"
                  className="hover:text-white transition"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Beauty"
                  className="hover:text-white transition"
                >
                  Beauty
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Shoes"
                  className="hover:text-white transition"
                >
                  Shoes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Accessories"
                  className="hover:text-white transition"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="text-red-400 hover:text-red-300 transition font-medium"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Help
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-white transition">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white transition">
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER + SOCIAL */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Stay in Touch
            </h3>

            <form onSubmit={(e) => e.preventDefault()} className="mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
              >
                Subscribe
              </button>
            </form>

            {/* Social icons — real brand SVGs */}
            <div className="flex items-center gap-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition text-white"
                aria-label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition text-white"
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-sky-500 flex items-center justify-center transition text-white"
                aria-label="Twitter"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-red-600 flex items-center justify-center transition text-white"
                aria-label="YouTube"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR — payment + copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {year} ShopHub. All rights reserved.
          </p>

          {/* Payment logos */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-xs text-gray-500">Secure payments:</span>

            {/* Visa */}
            <div className="h-8 w-12 rounded-md bg-white flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 32 10" className="h-3.5 w-auto">
                <text
                  x="0"
                  y="8"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  fontSize="10"
                  fill="#1434CB"
                  fontStyle="italic"
                >
                  VISA
                </text>
              </svg>
            </div>

            {/* Mastercard */}
            <div className="h-8 w-12 rounded-md bg-white flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 40 24" className="h-4 w-auto">
                <circle cx="14" cy="12" r="9" fill="#EB001B" />
                <circle cx="26" cy="12" r="9" fill="#F79E1B" />
                <path
                  d="M20 4.5c2.4 1.6 4 4.3 4 7.5s-1.6 5.9-4 7.5c-2.4-1.6-4-4.3-4-7.5s1.6-5.9 4-7.5z"
                  fill="#FF5F00"
                />
              </svg>
            </div>

            {/* PayPal */}
            <div className="h-8 w-12 rounded-md bg-white flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 50 14" className="h-4 w-auto">
                <text
                  x="0"
                  y="11"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  fontStyle="italic"
                  fontSize="11"
                  fill="#003087"
                >
                  Pay
                </text>
                <text
                  x="22"
                  y="11"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  fontStyle="italic"
                  fontSize="11"
                  fill="#009CDE"
                >
                  Pal
                </text>
              </svg>
            </div>

            {/* Apple Pay */}
            <div className="h-8 w-14 rounded-md bg-black flex items-center justify-center shadow-sm gap-1">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <svg viewBox="0 0 40 14" className="h-3.5 w-auto">
                <text
                  x="0"
                  y="11"
                  fontFamily="Arial, sans-serif"
                  fontWeight="600"
                  fontSize="12"
                  fill="white"
                >
                  Pay
                </text>
              </svg>
            </div>

            {/* Google Pay */}
            <div className="h-8 w-14 rounded-md bg-white flex items-center justify-center shadow-sm gap-1 px-1.5">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-[10px] font-semibold text-gray-700">
                Pay
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
