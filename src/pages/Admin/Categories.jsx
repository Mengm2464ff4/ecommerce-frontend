import { useEffect, useState } from "react";
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileText,
  Hash,
} from "lucide-react";
import { categoryApi } from "../../api/category";

const emptyForm = { name: "", description: "" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Light + dark color palette
  const COLORS = [
    {
      bg: "bg-blue-100 dark:bg-blue-500/20",
      text: "text-blue-700 dark:text-blue-300",
      icon: "bg-blue-500",
    },
    {
      bg: "bg-purple-100 dark:bg-purple-500/20",
      text: "text-purple-700 dark:text-purple-300",
      icon: "bg-purple-500",
    },
    {
      bg: "bg-green-100 dark:bg-green-500/20",
      text: "text-green-700 dark:text-green-300",
      icon: "bg-green-500",
    },
    {
      bg: "bg-orange-100 dark:bg-orange-500/20",
      text: "text-orange-700 dark:text-orange-300",
      icon: "bg-orange-500",
    },
    {
      bg: "bg-pink-100 dark:bg-pink-500/20",
      text: "text-pink-700 dark:text-pink-300",
      icon: "bg-pink-500",
    },
    {
      bg: "bg-indigo-100 dark:bg-indigo-500/20",
      text: "text-indigo-700 dark:text-indigo-300",
      icon: "bg-indigo-500",
    },
    {
      bg: "bg-yellow-100 dark:bg-yellow-500/20",
      text: "text-yellow-700 dark:text-yellow-300",
      icon: "bg-yellow-500",
    },
    {
      bg: "bg-teal-100 dark:bg-teal-500/20",
      text: "text-teal-700 dark:text-teal-300",
      icon: "bg-teal-500",
    },
  ];

  const getColor = (id) => COLORS[(id - 1) % COLORS.length];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await categoryApi.getAll();
      const data = res.data.data || res.data;
      setCategories(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await categoryApi.update(editingId, form);
        showToast("Category updated successfully");
      } else {
        await categoryApi.create(form);
        showToast("Category created successfully");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      const msg = err.response?.data?.message || err.message || "Save failed";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setForm({
      name: category.name,
      description: category.description || "",
    });
    setEditingId(category.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await categoryApi.remove(id);
      showToast("Category deleted");
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      showToast(
        err.response?.data?.message || "Delete failed — category may be in use",
        "error",
      );
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
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

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Tags className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Categories
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {categories.length} categor
              {categories.length !== 1 ? "ies" : "y"} total
            </p>
          </div>
        </div>

        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* FORM CARD */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-white dark:from-purple-500/10 dark:to-transparent">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {editingId ? (
              <>
                <Pencil className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Edit Category
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Add New Category
              </>
            )}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tags className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                Category Name
              </label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Electronics"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                Description
              </label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                <>
                  <Save className="w-4 h-4" />
                  Update Category
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Category
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg font-medium transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Tags className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            All Categories
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-purple-200 dark:border-purple-500/30 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Loading categories...
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <Tags className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "No categories match your search"
                : "No categories yet"}
            </p>
            {!searchQuery && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Create your first category using the form above
              </p>
            )}
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => {
              const color = getColor(cat.id);
              return (
                <div
                  key={cat.id}
                  className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${color.icon}`}
                  />

                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Tags className={`w-6 h-6 ${color.text}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {cat.description || "No description"}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        ID: {cat.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
