import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, SlidersHorizontal, Check } from "lucide-react";

// ============ OPTIONS ============
const BRANDS = ["Nike", "Adidas", "Zara", "H&M", "Levi's", "Puma", "Gucci"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Gray", hex: "#6b7280" },
];
const FITS = ["Slim Fit", "Regular Fit", "Oversized", "Skinny", "Loose"];

export default function FilterSidebar({
  selectedFilters,
  onFilterChange,
  onClearAll,
  isMobileOpen,
  onCloseMobile,
}) {
  const [openSection, setOpenSection] = useState("brands");

  const toggleSection = (key) =>
    setOpenSection(openSection === key ? null : key);

  const isActive = (list, value) => list?.includes(value);

  const toggleInList = (key, value) => {
    const current = selectedFilters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(key, next);
  };

  const activeCount =
    (selectedFilters.brands?.length || 0) +
    (selectedFilters.sizes?.length || 0) +
    (selectedFilters.colors?.length || 0) +
    (selectedFilters.fits?.length || 0) +
    (selectedFilters.minPrice ? 1 : 0) +
    (selectedFilters.maxPrice ? 1 : 0);

  const content = (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
              {activeCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {activeCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Clear all
            </button>
          )}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* ============ BRANDS ============ */}
      <Section
        title="Brands"
        isOpen={openSection === "brands"}
        onToggle={() => toggleSection("brands")}
      >
        <div className="space-y-1.5">
          {BRANDS.map((brand) => (
            <Checkbox
              key={brand}
              label={brand}
              checked={isActive(selectedFilters.brands, brand)}
              onChange={() => toggleInList("brands", brand)}
            />
          ))}
        </div>
      </Section>

      {/* ============ PRICE ============ */}
      <Section
        title="Price"
        isOpen={openSection === "price"}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Min
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={selectedFilters.minPrice || ""}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
            <span className="text-gray-400 pt-5">–</span>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Max
              </label>
              <input
                type="number"
                min="0"
                placeholder="9999"
                value={selectedFilters.maxPrice || ""}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick price ranges */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Under $25", min: "", max: "25" },
              { label: "$25–$50", min: "25", max: "50" },
              { label: "$50–$100", min: "50", max: "100" },
              { label: "$100+", min: "100", max: "" },
            ].map((r) => (
              <button
                key={r.label}
                onClick={() => {
                  onFilterChange("minPrice", r.min);
                  onFilterChange("maxPrice", r.max);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                  selectedFilters.minPrice === r.min &&
                  selectedFilters.maxPrice === r.max
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ SIZE ============ */}
      <Section
        title="Size"
        isOpen={openSection === "size"}
        onToggle={() => toggleSection("size")}
      >
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleInList("sizes", s)}
              className={`min-w-[42px] h-9 px-3 rounded-lg text-xs font-medium border transition ${
                isActive(selectedFilters.sizes, s)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      {/* ============ COLOR ============ */}
      <Section
        title="Color"
        isOpen={openSection === "color"}
        onToggle={() => toggleSection("color")}
      >
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => {
            const active = isActive(selectedFilters.colors, c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggleInList("colors", c.name)}
                title={c.name}
                className={`relative w-8 h-8 rounded-full border-2 transition ${
                  active
                    ? "border-blue-600 ring-2 ring-blue-500/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {active && (
                  <Check
                    className={`absolute inset-0 m-auto w-4 h-4 ${
                      c.name === "White" ? "text-gray-900" : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ============ FIT ============ */}
      <Section
        title="Fit"
        isOpen={openSection === "fit"}
        onToggle={() => toggleSection("fit")}
      >
        <div className="space-y-1.5">
          {FITS.map((f) => (
            <Checkbox
              key={f}
              label={f}
              checked={isActive(selectedFilters.fits, f)}
              onChange={() => toggleInList("fits", f)}
            />
          ))}
        </div>
      </Section>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-32 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 max-h-[calc(100vh-9rem)] overflow-y-auto">
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-[1000] shadow-2xl overflow-y-auto p-5"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============ SECTION (collapsible) ============
function Section({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 py-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-1.5 group"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
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
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ CHECKBOX ============
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group px-1 py-1">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
          checked
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300 dark:border-gray-600 group-hover:border-blue-400"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition">
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}
