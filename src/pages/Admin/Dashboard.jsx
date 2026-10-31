import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Tags,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          api.get("/products?page=0&size=1"),
          api.get("/categories/all"),
          api.get("/orders/admin/all?page=0&size=1").catch(() => null),
          api.get("/users").catch(() => null),
        ]);

        const getTotal = (res) => {
          if (!res || res.status !== "fulfilled" || !res.value) return 0;
          const data = res.value.data?.data || res.value.data;
          if (Array.isArray(data)) return data.length;
          if (data?.totalElements != null) return data.totalElements;
          if (data?.content) return data.content.length;
          return 0;
        };

        setStats({
          products: getTotal(results[0]),
          categories: getTotal(results[1]),
          orders: getTotal(results[2]),
          users: getTotal(results[3]),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    {
      label: "Products",
      value: stats.products,
      icon: Package,
      bg: "bg-blue-50 dark:bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
      link: "/admin/products",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: Tags,
      bg: "bg-purple-50 dark:bg-purple-500/10",
      textColor: "text-purple-600 dark:text-purple-400",
      link: "/admin/categories",
    },
    {
      label: "Orders",
      value: stats.orders,
      icon: ShoppingBag,
      bg: "bg-green-50 dark:bg-green-500/10",
      textColor: "text-green-600 dark:text-green-400",
      link: "/admin/orders",
    },
    {
      label: "Users",
      value: stats.users,
      icon: Users,
      bg: "bg-orange-50 dark:bg-orange-500/10",
      textColor: "text-orange-600 dark:text-orange-400",
      link: "/admin/users",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      description: "Create a new product listing",
      icon: Package,
      to: "/admin/products",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20",
    },
    {
      title: "New Category",
      description: "Organize your products",
      icon: Tags,
      to: "/admin/categories",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20",
    },
    {
      title: "View Orders",
      description: "Manage customer orders",
      icon: ShoppingBag,
      to: "/admin/orders",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/20",
    },
    {
      title: "Manage Users",
      description: "View registered users",
      icon: Users,
      to: "/admin/users",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20",
    },
  ];

  const recentActivity = [
    {
      icon: CheckCircle2,
      color:
        "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-500/10",
      text: "Order #1024 was placed",
      time: "2 min ago",
    },
    {
      icon: Package,
      color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10",
      text: "New product added to Electronics",
      time: "15 min ago",
    },
    {
      icon: Users,
      color:
        "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10",
      text: "New user registered",
      time: "1 hour ago",
    },
    {
      icon: Clock,
      color:
        "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-500/10",
      text: "Payment pending for order #1023",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl" />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium text-blue-100 mb-1">
              Welcome back 👋
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Hello, {user?.username || "Admin"}!
            </h1>
            <p className="text-blue-100 max-w-lg">
              Here's what's happening with your store today.
            </p>
          </div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-medium transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="group bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  +12%
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {card.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <span className="inline-block w-12 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                ) : (
                  card.value
                )}
              </p>
            </Link>
          );
        })}
      </div>

      {/* QUICK ACTIONS + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Quick Actions
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              4 actions
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className={`group ${action.bg} rounded-xl p-4 transition flex items-center gap-4`}
                >
                  <div className="w-11 h-11 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 ${action.color} group-hover:translate-x-1 transition-transform`}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Activity
            </h2>
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                      {item.text}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* INFO BANNER */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
            Admin tip
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-400/80">
            You can add product images by dragging and dropping them into the
            form on the Products page. Try it out!
          </p>
        </div>
      </div>
    </div>
  );
}
