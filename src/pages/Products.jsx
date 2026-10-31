import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { productApi } from "../api/product";
import { categoryApi } from "../api/category";
import ProductList from "../components/products/ProductList";
import ProductSearch from "../components/products/ProductSearch";
import FilterSidebar from "../components/products/FilterSidebar";
import { PAGE_SIZE } from "../utils/constants";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // ============ READ FILTERS FROM URL ============
  const categoryName = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const brandsParam = searchParams.get("brands") || "";
  const sizesParam = searchParams.get("sizes") || "";
  const colorsParam = searchParams.get("colors") || "";
  const fitsParam = searchParams.get("fits") || "";
  const subcategoryParam = searchParams.get("subcategory") || "";
  const sortParam = searchParams.get("sort") || "";
  const newOnlyParam = searchParams.get("newOnly") || "";

  const selectedFilters = {
    minPrice,
    maxPrice,
    brands: brandsParam ? brandsParam.split(",") : [],
    sizes: sizesParam ? sizesParam.split(",") : [],
    colors: colorsParam ? colorsParam.split(",") : [],
    fits: fitsParam ? fitsParam.split(",") : [],
  };

  // ============ LOAD CATEGORIES ============
  useEffect(() => {
    categoryApi
      .getAll()
      .then((res) => {
        const payload = res.data.data;
        const list = Array.isArray(payload) ? payload : payload?.content || [];
        setCategories(list);
        setCategoriesLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        setCategories([]);
        setCategoriesLoaded(true);
      });
  }, []);

  // ============ FETCH PRODUCTS ============
  useEffect(() => {
    // Wait for categories only when a category filter is present
    if (categoryName && !categoriesLoaded) return;

    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Resolve category name → id
        let categoryId = null;
        if (categoryName && categories.length > 0) {
          const found = categories.find(
            (c) =>
              c.name.trim().toLowerCase() === categoryName.trim().toLowerCase(),
          );
          if (found) categoryId = found.id;
        }

        const apiParams = { page, size: PAGE_SIZE };
        if (searchQuery) apiParams.name = searchQuery;
        if (categoryId) apiParams.categoryId = categoryId;
        if (minPrice) apiParams.minPrice = minPrice;
        if (maxPrice) apiParams.maxPrice = maxPrice;
        if (subcategoryParam) apiParams.subcategory = subcategoryParam;
        if (brandsParam) apiParams.brand = brandsParam;
        if (sizesParam) apiParams.productSize = sizesParam;
        if (colorsParam) apiParams.color = colorsParam;
        if (fitsParam) apiParams.fit = fitsParam;
        if (sortParam) apiParams.sort = sortParam;
        if (newOnlyParam) apiParams.newOnly = newOnlyParam === "true" ? true : undefined``;

        const hasFilters =
          apiParams.name ||
          apiParams.categoryId ||
          apiParams.minPrice ||
          apiParams.maxPrice ||
          apiParams.subcategory ||
          apiParams.brand ||
          apiParams.productSize ||
          apiParams.color ||
          apiParams.fit ||
          apiParams.sort ||
          apiParams.newOnly;

        let res;
        if (hasFilters) {
          res = await productApi.search(apiParams);
        } else {
          res = await productApi.getActive(page, PAGE_SIZE, sortParam);
        }

        if (cancelled) return;

        const data = res.data.data || res.data;
        const list = Array.isArray(data) ? data : data?.content || [];

        setProducts(list);
        setTotalPages(data?.totalPages || 0);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    categoryName,
    searchQuery,
    minPrice,
    maxPrice,
    brandsParam,
    sizesParam,
    colorsParam,
    fitsParam,
    subcategoryParam,
    sortParam,
    categories,
    categoriesLoaded,
  ]);

  // ============ HANDLERS ============
  const handleSearch = (newFilters) => {
    setPage(0);
    const params = new URLSearchParams(searchParams);

    if (newFilters.name) params.set("search", newFilters.name);
    else params.delete("search");

    if (newFilters.minPrice != null && newFilters.minPrice !== "") {
      params.set("minPrice", newFilters.minPrice);
    } else {
      params.delete("minPrice");
    }

    if (newFilters.maxPrice != null && newFilters.maxPrice !== "") {
      params.set("maxPrice", newFilters.maxPrice);
    } else {
      params.delete("maxPrice");
    }

    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setPage(0);
    const params = new URLSearchParams(searchParams);

    if (key === "minPrice" || key === "maxPrice") {
      if (value) params.set(key, value);
      else params.delete(key);
    } else {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else {
        params.delete(key);
      }
    }
    setSearchParams(params);
  };

  const handleClearAll = () => {
    setPage(0);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categoryName) params.set("category", categoryName);
    setSearchParams(params);
  };

  // ============ PAGE HEADING ============
  const heading = searchQuery
    ? `Search: "${searchQuery}"`
    : categoryName
      ? `${categoryName}'s Collection`
      : sortParam === "new"
        ? "New Arrivals"
        : sortParam === "trending"
          ? "Trending Now"
          : sortParam === "featured"
            ? "Editor's Picks"
            : "All Products";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {heading}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search */}
        <ProductSearch onSearch={handleSearch} />

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden mb-4 inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        {/* Layout: sidebar + grid */}
        <div className="flex gap-6">
          {!searchQuery && (
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              isMobileOpen={mobileFiltersOpen}
              onCloseMobile={() => setMobileFiltersOpen(false)}
            />
          )}

          <div className="flex-1 min-w-0">
            <ProductList
              products={products}
              loading={loading}
              error={error}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onRetry={() => setPage((p) => p)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
