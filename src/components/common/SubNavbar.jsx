import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Flame, Percent } from "lucide-react";

// ======================================================
// IMAGE HELPER
// ======================================================

const imageUrl = (id, width = 900) =>
  `https://images.unsplash.com/${id}?w=${width}&q=90&auto=format&fit=crop`;

// ======================================================
// LEFT NAVIGATION ITEMS
// ======================================================

const SUB_ITEMS = [
  {
    label: "New In",
    to: "/products?sort=new&newOnly=true",
    image: imageUrl("photo-1490481651871-ab68de25d43d"),
    badge: "New",
    description: "Discover the latest arrivals and fresh new styles.",
    dropdown: [
      {
        label: "Latest Drops",
        to: "/products?sort=new&newOnly=true",
        image: imageUrl("photo-1441986300917-64674bd600d8", 700),
      },
      {
        label: "Trending Now",
        to: "/products?sort=trending",
        image: imageUrl("photo-1483985988355-763728e1935b", 700),
      },
      {
        label: "Editor's Picks",
        to: "/products?sort=featured",
        image: imageUrl("photo-1469334031218-e382a71b716b", 700),
      },
    ],
  },

  {
    label: "Clothing",
    to: "/products?category=Fashion",
    image: imageUrl("photo-1521572163474-6864f9cf17ab"),
    description: "Shop everyday essentials and standout fashion pieces.",
    dropdown: [
      {
        label: "T-Shirts & Tops",
        to: "/products?category=Fashion&search=t-shirt",
        image: imageUrl("photo-1521572163474-6864f9cf17ab", 700),
      },
      {
        label: "Dresses",
        to: "/products?category=Fashion&search=dress",
        image: imageUrl("photo-1490481651871-ab68de25d43d", 700),
      },
      {
        label: "Jeans & Trousers",
        to: "/products?category=Fashion&search=jean",
        image: imageUrl("photo-1542272604-787c3835535d", 700),
      },
      {
        label: "Jackets & Coats",
        to: "/products?category=Fashion&search=jacket",
        image: imageUrl("photo-1551028719-00167b16eac5", 700),
      },
      {
        label: "Hoodies & Sweats",
        to: "/products?category=Fashion&search=hoodie",
        image: imageUrl("photo-1556821840-3a63f95609a7", 700),
      },
      {
        label: "Activewear",
        to: "/products?category=Fashion&search=activewear",
        image: imageUrl("photo-1517836357463-d25dfeac3438", 700),
      },
    ],
  },

  {
    label: "Accessories",
    to: "/products?category=Accessories",
    image: imageUrl("photo-1523170335258-f5ed11844a49"),
    description: "Complete your look with carefully selected accessories.",
    dropdown: [
      {
        label: "Watches",
        to: "/products?category=Accessories&search=watch",
        image: imageUrl("photo-1523170335258-f5ed11844a49", 700),
      },
      {
        label: "Bags & Backpacks",
        to: "/products?category=Accessories&search=bag",
        image: imageUrl("photo-1553062407-98eeb64c6a62", 700),
      },
      {
        label: "Sunglasses",
        to: "/products?category=Accessories&search=sunglass",
        image: imageUrl("photo-1511499767150-a48a237f0083", 700),
      },
      {
        label: "Jewelry",
        to: "/products?category=Accessories&search=jewelry",
        image: imageUrl("photo-1611652022419-a9419f74343d", 700),
      },
      {
        label: "Belts",
        to: "/products?category=Accessories&search=belt",
        image: imageUrl("photo-1624222247344-550fb60583dc", 700),
      },
      {
        label: "Hats & Caps",
        to: "/products?category=Accessories&search=hat,cap",
        image: imageUrl("photo-1588850561407-ed78c282e89b", 700),
      },
    ],
  },

  {
    label: "Shoes",
    to: "/products?category=Shoes",
    image: imageUrl("photo-1600185365483-26d7a4cc7519"),
    description: "Find the perfect pair for every occasion.",
    dropdown: [
      {
        label: "Sneakers",
        to: "/products?category=Shoes&search=sneaker",
        image: imageUrl("photo-1600185365483-26d7a4cc7519", 700),
      },
      {
        label: "Running",
        to: "/products?category=Shoes&search=running",
        image: imageUrl("photo-1542291026-7eec264c27ff", 700),
      },
      {
        label: "Boots",
        to: "/products?category=Shoes&search=boot",
        image: imageUrl("photo-1520639888713-7851133b1ed0", 700),
      },
      {
        label: "Sandals",
        to: "/products?category=Shoes&search=sandal",
        image: imageUrl("photo-1603487742131-4160ec999306", 700),
      },
      {
        label: "Formal",
        to: "/products?category=Shoes&search=formal",
        image: imageUrl("photo-1614252369475-531eba835eb1", 700),
      },
      {
        label: "Loafers",
        to: "/products?category=Shoes&search=loafer",
        image: imageUrl("photo-1533867617858-e7b97e060509", 700),
      },
    ],
  },

  {
    label: "Beauty",
    to: "/products?category=Beauty",
    image: imageUrl("photo-1556228720-195a672e8a03"),
    description: "Explore skincare, fragrance, makeup and more.",
    dropdown: [
      {
        label: "Skincare",
        to: "/products?category=Beauty&search=skincare",
        image: imageUrl("photo-1556228720-195a672e8a03", 700),
      },
      {
        label: "Makeup",
        to: "/products?category=Beauty&search=makeup",
        image: imageUrl("photo-1512496015851-a90fb38ba796", 700),
      },
      {
        label: "Fragrance",
        to: "/products?category=Beauty&search=fragrance",
        image: imageUrl("photo-1541643600914-78b084683601", 700),
      },
      {
        label: "Hair Care",
        to: "/products?category=Beauty&search=hair",
        image: imageUrl("photo-1522338242992-e1a54906a8da", 700),
      },
      {
        label: "Bath & Body",
        to: "/products?category=Beauty&search=bath",
        image: imageUrl("photo-1608571423902-eed4a5ad8108", 700),
      },
    ],
  },

  {
    label: "Home",
    to: "/products?category=Home",
    image: imageUrl("photo-1555041469-a586c61ea9bc"),
    description: "Refresh your space with beautiful home essentials.",
    dropdown: [
      {
        label: "Furniture",
        to: "/products?category=Home&search=furniture",
        image: imageUrl("photo-1555041469-a586c61ea9bc", 700),
      },
      {
        label: "Kitchen",
        to: "/products?category=Home&search=kitchen",
        image: imageUrl("photo-1556909212-d5b604d0c90d", 700),
      },
      {
        label: "Bedding",
        to: "/products?category=Home&search=bedding",
        image: imageUrl("photo-1522771739844-6a9f6d5f14af", 700),
      },
      {
        label: "Decor",
        to: "/products?category=Home&search=decor",
        image: imageUrl("photo-1493663284031-b7e3aefcae8e", 700),
      },
      {
        label: "Lighting",
        to: "/products?category=Home&search=lamp",
        image: imageUrl("photo-1507473885765-e6ed057f782c", 700),
      },
    ],
  },

  {
    label: "Sports",
    to: "/products?category=Sports",
    image: imageUrl("photo-1534438327276-14e5300c3a48"),
    description: "Gear up for training, fitness and outdoor adventures.",
    dropdown: [
      {
        label: "Gym & Fitness",
        to: "/products?category=Sports&search=gym",
        image: imageUrl("photo-1534438327276-14e5300c3a48", 700),
      },
      {
        label: "Outdoor",
        to: "/products?category=Sports&search=outdoor",
        image: imageUrl("photo-1551632811-561732d1e306", 700),
      },
      {
        label: "Cycling",
        to: "/products?category=Sports&search=cycling",
        image: imageUrl("photo-1517649763962-0c623066013b", 700),
      },
      {
        label: "Swimming",
        to: "/products?category=Sports&search=swim",
        image: imageUrl("photo-1530549387789-4c1017266635", 700),
      },
    ],
  },
];

// ======================================================
// RIGHT NAVIGATION ITEMS
// ======================================================

const RIGHT_ITEMS = [
  {
    label: "Shop By Collection",
    to: "/categories",
    image: imageUrl("photo-1483985988355-763728e1935b"),
    description: "Browse our carefully curated collections.",
    dropdown: [
      {
        label: "New Arrivals",
        to: "/products?sort=new",
        image: imageUrl("photo-1441986300917-64674bd600d8", 700),
      },
      {
        label: "Fashion Picks",
        to: "/products?category=Fashion",
        image: imageUrl("photo-1489987707025-afc232f7ea0f", 700),
      },
      {
        label: "Beauty Favorites",
        to: "/products?category=Beauty",
        image: imageUrl("photo-1522335789203-aabd1fc54bc9", 700),
      },
      {
        label: "Shoes Collection",
        to: "/products?category=Shoes",
        image: imageUrl("photo-1542291026-7eec264c27ff", 700),
      },
      {
        label: "Accessories",
        to: "/products?category=Accessories",
        image: imageUrl("photo-1523170335258-f5ed11844a49", 700),
      },
    ],
  },

  {
    label: "Sale",
    to: "/deals",
    Icon: Percent,
    highlight: true,
  },
];

// ======================================================
// IMAGE FALLBACK COMPONENT
// ======================================================


function NavImage({
  src,
  alt,
  className = "",
  fallbackText = "Image",
  loading = "lazy",
}) {
  const fallbackImage = `https://placehold.co/900x700/f3f4f6/6b7280?text=${encodeURIComponent(
    fallbackText,
  )}`;

return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      onError={(event) => {
        if (event.currentTarget.src !== fallbackImage) {
          event.currentTarget.src = fallbackImage;
        }
      }}
    />
  );
}

// ======================================================
// SUB NAVBAR COMPONENT
// ======================================================

export default function SubNavbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  // Close the dropdown after changing routes
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname, location.search]);

  const handleMouseEnter = (label) => {
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const handleDropdownClick = () => {
    setOpenDropdown(null);
  };

  const hiddenRoutes = ["/login", "/register", "/admin", "/profile"];

  const shouldHideNavbar = hiddenRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  if (shouldHideNavbar) {
    return null;
  }

  const allItems = [...SUB_ITEMS, ...RIGHT_ITEMS];

  const activeDropdownItem = allItems.find(
    (item) => item.label === openDropdown,
  );

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onMouseLeave={handleMouseLeave}
      aria-label="Main category navigation"
      className="relative z-40 hidden border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/95 md:block"
    >
      {/* TOP NAVIGATION */}

      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center justify-center gap-2">
          {/* LEFT NAVIGATION ITEMS */}

          <div className="flex flex-shrink-0 items-center gap-0.5">
            {SUB_ITEMS.map((item) => {
              const hasDropdown =
                Array.isArray(item.dropdown) && item.dropdown.length > 0;

              const isOpen = openDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                >
                  <Link
                    to={item.to}
                    aria-haspopup={hasDropdown}
                    aria-expanded={isOpen}
                    className={[
                      "group flex items-center gap-1 rounded-full border px-1.5 py-1 text-xs font-medium",
                      "whitespace-nowrap transition-all duration-200",
                      isOpen
                        ? "border-gray-200 bg-gray-100 text-gray-950 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800",
                    ].join(" ")}
                  >
                    <span className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200 shadow-sm ring-1 ring-white dark:bg-gray-800 dark:ring-gray-900">
                      <NavImage
                        src={item.image}
                        alt={`${item.label} collection`}
                        fallbackText={item.label}
                        loading={item.label === "New In" ? "eager" : "lazy"}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      />

                      {item.badge && (
                        <span className="absolute inset-x-0 bottom-0 bg-black/70 px-0.5 py-0.5 text-center text-[7px] font-extrabold uppercase tracking-wide text-white">
                          {item.badge}
                        </span>
                      )}
                    </span>

                    <span className="font-semibold">{item.label}</span>

                    {hasDropdown && (
                      <ChevronDown
                        aria-hidden="true"
                        className={[
                          "h-3 w-3 flex-shrink-0 transition-transform duration-200",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* RIGHT NAVIGATION ITEMS */}

          <div className="flex flex-shrink-0 items-center gap-0.5">
            {RIGHT_ITEMS.map((item) => {
              const Icon = item.Icon;

              const hasDropdown =
                Array.isArray(item.dropdown) && item.dropdown.length > 0;

              const isOpen = openDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                >
                  <Link
                    to={item.to}
                    aria-haspopup={hasDropdown}
                    aria-expanded={isOpen}
                    className={[
                      "group flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-semibold",
                      "whitespace-nowrap transition-all duration-200",
                      item.highlight
                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md shadow-red-500/25 hover:from-red-600 hover:to-orange-600"
                        : isOpen
                          ? "bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-white"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                    ].join(" ")}
                  >
                    {item.image ? (
                      <span className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                        <NavImage
                          src={item.image}
                          alt={`${item.label} collection`}
                          fallbackText={item.label}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </span>
                    ) : (
                      Icon && (
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 flex-shrink-0"
                        />
                      )
                    )}

                    <span>{item.label}</span>

                    {hasDropdown && (
                      <ChevronDown
                        aria-hidden="true"
                        className={[
                          "h-3 w-3 flex-shrink-0 transition-transform duration-200",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    )}

                    {item.highlight && (
                      <Flame
                        aria-hidden="true"
                        className="h-3.5 w-3.5 flex-shrink-0 fill-current"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DROPDOWN */}

      <AnimatePresence mode="wait">
        {activeDropdownItem?.dropdown && (
          <motion.div
            key={activeDropdownItem.label}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            onMouseEnter={() => handleMouseEnter(activeDropdownItem.label)}
            className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-7 lg:grid-cols-4">
                {/* FEATURED CARD */}

                <div className="lg:col-span-1">
                  <div className="group relative mb-3 h-56 overflow-hidden rounded-2xl shadow-xl">
                    <NavImage
                      src={activeDropdownItem.image}
                      alt={`${activeDropdownItem.label} featured collection`}
                      fallbackText={activeDropdownItem.label}
                      loading="eager"
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {activeDropdownItem.label === "New In" && (
                      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-950 shadow-lg">
                        New In
                      </span>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                        {activeDropdownItem.label === "New In"
                          ? "Fresh arrivals"
                          : "Explore category"}
                      </p>

                      <p className="text-2xl font-bold text-white">
                        {activeDropdownItem.label}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {activeDropdownItem.description ||
                      `Explore everything in ${activeDropdownItem.label.toLowerCase()}.`}
                  </p>

                  <Link
                    to={activeDropdownItem.to}
                    onClick={handleDropdownClick}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Shop all
                    <ChevronDown
                      aria-hidden="true"
                      className="h-4 w-4 -rotate-90"
                    />
                  </Link>
                </div>

                {/* DROPDOWN ITEMS */}

                <div className="lg:col-span-3">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {activeDropdownItem.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.to}
                        onClick={handleDropdownClick}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-900"
                      >
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                          <NavImage
                            src={subItem.image}
                            alt={subItem.label}
                            fallbackText={subItem.label}
                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                            {subItem.label}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Shop now
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
