import { useEffect, useRef, useState } from "react";
import { productApi } from "../../api/product";
import { categoryApi } from "../../api/category";
import { formatPrice, getImageUrl } from "../../utils/helpers";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  XCircle,
  Tag,
  DollarSign,
  Boxes,
  FileText,
  Search,
  RefreshCw,
  AlertCircle,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Star, // ADD
  Percent, // 👈 ADD
} from "lucide-react";

const SUBCATEGORIES = {
  Women: ["Dresses", "Tops", "Skirts", "Bags", "Heels", "Jewelry"],
  Men: ["T-Shirts", "Shirts", "Jeans", "Jackets", "Shoes", "Watches"],
  Beauty: ["Skincare", "Makeup", "Fragrance", "Hair Care", "Bath & Body"],
    Kids: ["Baby", "Toddler", "Kids", "Toys", "Shoes", "Accessories", "Jackets", "Hoodies"],
  Lifestyle: ["Home", "Kitchen", "Travel", "Stationery", "Collectibles"],
  Fashion: [
    "Street",
    "Casual",
    "T-Shirts",
    "Dresses",
    "Jeans",
    "Jackets",
    "Hoodies",
    "Activewear",
  ],
  News: ["Clothing", "Accessories", "Shoes", "Beauty", "Sports", "Home"],
  Shoes: ["Sneakers", "Running", "Boots", "Sandals", "Formal", "Loafers"],
  Accessories: ["Watches", "Bags", "Sunglasses", "Jewelry", "Belts", "Hats"],
  Home: ["Furniture", "Kitchen", "Bedding", "Decor", "Lighting"], // ADD
  Sports: ["Gym", "Outdoor", "Cycling", "Swim"], // 👈 ADD THIS
};

const BRANDS = [
  "Nike",
  "Adidas",
  "Zara",
  "H&M",
  "Levi's",
  "Puma",
  "Gucci",
  "Other",
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "32", "7", "8", "9", "10", "10.5", "One Size"];
const COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Gray",
  "Brown",
   "Champagne",   
  "Beige",       
  "Navy Blue",   
  "Floral",      
  "Terracotta",  
  "Oatmeal",     
  "Tan",         
  "Gold",        
  "Silver",      
  "Purple",      
];
const FITS = ["Slim Fit", "Regular Fit", "Oversized", "Skinny", "Loose", "Relaxed Fit", "Straight Fit", "Compression", "A-Line", "Flared", "Scoop Neck"];
const ITEMS_PER_PAGE = 10;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  subcategory: "",
  brand: "",
  size: "",
  color: "",
  fit: "",
  rating: "",
  ratingCount: "",
  badge: "", 
  discountPercent: "",
  imageUrl: "", 
};

// Add badge + discount options at the top
const BADGE_OPTIONS = [
  "",
  "Hot Deal",
  "Best Seller",
  "Trending",
  "Limited",
  "Popular",
  "Flash Sale",
  "New Arrival",
  "Top Rated",
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        productApi.getAll(0, 100),
        categoryApi.getAll(),
      ]);
      const allProducts = (pRes.data.data || pRes.data).content || [];
      setProducts(allProducts);
      const catData = cRes.data.data;
      const catList = Array.isArray(catData) ? catData : catData?.content || [];
      setCategories(catList);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Reset to page 1 when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("Image must be under 10 MB", "error");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        rating: form.rating ? Number(form.rating) : 0,
        ratingCount: form.ratingCount ? Number(form.ratingCount) : 0,
      };

      let productId = editingId;

      if (editingId) {
        await productApi.update(editingId, payload);
        showToast("Product updated successfully");
      } else {
        const res = await productApi.create(payload);
        const created = res.data.data || res.data;
        productId = created.id;
        showToast("Product created successfully");
      }

      if (imageFile && productId) {
        try {
          await productApi.uploadImage(productId, imageFile);
        } catch (uploadErr) {
          console.error(
            "Image upload failed:",
            uploadErr.response?.data || uploadErr,
          );
          showToast("Product saved, but image upload failed", "error");
        }
      }

      setForm(emptyForm);
      setEditingId(null);
      clearImage();
      setShowForm(false);
      await fetchAll();
    } catch (err) {
      console.error("Save error:", err.response?.data || err);
      const msg = err.response?.data?.message || err.message || "Save failed";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      subcategory: product.subcategory || "",
      brand: product.brand || "",
      size: product.size || "",
      color: product.color || "",
      fit: product.fit || "",
      rating: product.rating || "",
      ratingCount: product.ratingCount || "",
      badge: product.badge || "", 
      discountPercent: product.discountPercent || "", 
      imageUrl: product.imageUrl || "",
    });
    setEditingId(product.id);
    clearImage();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    clearImage();
    setError("");
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this product?")) return;
    try {
      await productApi.remove(id);
      showToast("Product deactivated");
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleImageUpload = async (id, file) => {
    try {
      await productApi.uploadImage(id, file);
      showToast("Image uploaded");
      fetchAll();
    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      showToast(
        err.response?.data?.message || err.message || "Upload failed",
        "error",
      );
    }
  };

  const handleImageDelete = async (id) => {
    if (!window.confirm("Delete this product image?")) return;
    try {
      await productApi.deleteImage(id);
      showToast("Image removed");
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete image failed", "error");
    }
  };

  // Filter by tab + search
  const filteredProducts = products
    .filter((p) => p.isActive)
    .filter((p) => (activeTab === "all" ? true : p.categoryName === activeTab))
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Pagination math
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Category counts
  const productsByCategory = products
    .filter((p) => p.isActive)
    .reduce((acc, p) => {
      const key = p.categoryName || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const selectedCategoryName = categories
    .find((c) => String(c.id) === String(form.categoryId))
    ?.name?.trim();

  const subcategoryOptions =
    SUBCATEGORIES[selectedCategoryName] ||
    SUBCATEGORIES[
      Object.keys(SUBCATEGORIES).find(
        (k) => k.toLowerCase() === (selectedCategoryName || "").toLowerCase(),
      )
    ] ||
    [];

  if (loading) return <LoadingSpinner message="Loading products..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Products
              </h1>
              <p className="text-sm text-gray-500">
                {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAll}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={() => {
                if (showForm) handleCancel();
                else setShowForm(true);
              }}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition ${
                showForm
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30"
              }`}
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4" />
                  Close Form
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add New Product
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {editingId ? (
                  <>
                    <Pencil className="w-5 h-5 text-blue-600" />
                    Edit Product #{editingId}
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-blue-600" />
                    Add New Product
                  </>
                )}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      Product Name
                    </label>
                    <input
                      required
                      name="name"
                      placeholder="e.g., Wireless Mouse"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        Price
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        placeholder="0.00"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Boxes className="w-4 h-4 text-gray-500" />
                        Stock
                      </label>
                      <input
                        required
                        type="number"
                        min="0"
                        name="stock"
                        placeholder="0"
                        value={form.stock}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      Category
                    </label>
                    <select
                      required
                      name="categoryId"
                      value={form.categoryId}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          categoryId: e.target.value,
                          subcategory: "",
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      Subcategory
                    </label>
                    <select
                      name="subcategory"
                      value={form.subcategory}
                      onChange={handleChange}
                      disabled={!form.categoryId}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {form.categoryId
                          ? "Select a subcategory"
                          : "Select a category first"}
                      </option>
                      {subcategoryOptions.map((sc) => (
                        <option key={sc} value={sc}>
                          {sc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        Brand
                      </label>
                      <select
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                      >
                        <option value="">Any brand</option>
                        {BRANDS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        Size
                      </label>
                      <select
                        name="size"
                        value={form.size}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                      >
                        <option value="">Any size</option>
                        {SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        Color
                      </label>
                      <select
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                      >
                        <option value="">Any color</option>
                        {COLORS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        Fit
                      </label>
                      <select
                        name="fit"
                        value={form.fit}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                      >
                        <option value="">Any fit</option>
                        {FITS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Rating */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Star className="w-4 h-4 text-gray-500" />
                        Rating (0–5)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        name="rating"
                        placeholder="4.5"
                        value={form.rating}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Star className="w-4 h-4 text-gray-500" />
                        Rating Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        name="ratingCount"
                        placeholder="0"
                        value={form.ratingCount}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    {/* ============ BADGE + DISCOUNT ============ */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Tag className="w-4 h-4 text-gray-500" />
                          Badge
                        </label>
                        <select
                          name="badge"
                          value={form.badge}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                        >
                          {BADGE_OPTIONS.map((b) => (
                            <option key={b} value={b}>
                              {b || "— No badge —"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Percent className="w-4 h-4 text-gray-500" />
                          Discount %
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="90"
                          name="discountPercent"
                          placeholder="0"
                          value={form.discountPercent}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe the product..."
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    Product Image
                  </label>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl transition ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                    style={{ minHeight: "280px" }}
                  >
                    {imagePreview ? (
                      <div className="relative p-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="mt-3 text-center">
                          <p className="text-xs text-gray-600 truncate">
                            {imageFile?.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <label
                        className="flex flex-col items-center justify-center h-full p-8 cursor-pointer"
                        style={{ minHeight: "280px" }}
                      >
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <UploadCloud className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, JPEG up to 10 MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>

                                      <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={form.imageUrl || ""}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  {imageFile && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Image ready to upload
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Update Product
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Product
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============ PRODUCTS TABLE CARD ============ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with search */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Boxes className="w-5 h-5 text-gray-600" />
              All Products
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                All
                <span className="ml-1.5 text-xs opacity-80">
                  ({products.filter((p) => p.isActive).length})
                </span>
              </button>

              {Object.entries(productsByCategory)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, count]) => (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                      activeTab === category
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                    <span className="ml-1.5 text-xs opacity-80">({count})</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Table body */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery
                  ? "No products match your search"
                  : "No products yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                          {p.imageUrl ? (
                            <img
                              src={getImageUrl(p.imageUrl)}
                              className="w-full h-full object-cover"
                              alt={p.name}
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        {(p.categoryName || p.subcategory) && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Tag className="w-3 h-3" />
                            {p.categoryName}
                            {p.subcategory ? ` › ${p.subcategory}` : ""}
                          </p>
                        )}
                        {(p.brand || p.size || p.color || p.fit) && (
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {[p.brand, p.size, p.color, p.fit]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-medium ${
                            p.stock > 0 ? "text-gray-900" : "text-red-600"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <label
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                            title="Upload new image"
                          >
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                e.target.files[0] &&
                                handleImageUpload(p.id, e.target.files[0])
                              }
                            />
                          </label>

                          {p.imageUrl && (
                            <button
                              onClick={() => handleImageDelete(p.id)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                              title="Remove image"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Deactivate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ============ PAGINATION ============ */}
          {filteredProducts.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {startIndex + 1}–
                  {Math.min(
                    startIndex + ITEMS_PER_PAGE,
                    filteredProducts.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredProducts.length}</span>{" "}
                products
              </p>

              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
