import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Store,
  Settings,
  Palette,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import ThemeToggle from "../../common/ThemeToggle";
import ProfileModal from "../ProfileModal"; // ← NEW

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // ← NEW
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarWidth = collapsed ? "lg:w-20" : "lg:w-64";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex transition-colors">
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800
          text-white shadow-2xl
          flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800 flex-shrink-0">
          <Link
            to="/admin"
            className="flex items-center gap-3 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Store className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-base font-bold whitespace-nowrap">ShopHub</p>
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  Admin Panel
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg items-center justify-center transition z-10"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
          )}
        </button>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Menu
            </p>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 relative
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/30"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? item.label : ""}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition ${
                    active ? "" : "group-hover:scale-110"
                  }`}
                />
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {active && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="py-3">
            <div className="border-t border-gray-800" />
          </div>

          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Quick Links
            </p>
          )}

          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`
              group flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-gray-300 hover:bg-gray-800 hover:text-white transition
              ${collapsed ? "justify-center" : ""}
            `}
            title={collapsed ? "Back to Store" : ""}
          >
            <Home className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition" />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">
                Back to Store
              </span>
            )}
          </Link>

          {/* Settings → opens Profile modal */}
          <button
            onClick={() => {
              setProfileOpen(true);
              setMobileOpen(false);
            }}
            className={`
              group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-gray-300 hover:bg-gray-800 hover:text-white transition
              ${collapsed ? "justify-center" : ""}
            `}
            title={collapsed ? "Settings" : ""}
          >
            <Settings className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition" />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">
                Settings
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="py-3">
            <div className="border-t border-gray-800" />
          </div>

          {/* THEME TOGGLE */}
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Preferences
            </p>
          )}

          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            } px-3 py-2 rounded-lg`}
          >
            {!collapsed && (
              <div className="flex items-center gap-2 text-gray-300">
                <Palette className="w-4 h-4" />
                <span className="text-sm font-medium">Theme</span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </nav>

        {/* USER + LOGOUT */}
        <div className="p-3 border-t border-gray-800 flex-shrink-0">
          <button
            onClick={() => setProfileOpen(true)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800/50
              hover:bg-gray-800 transition text-left
              ${collapsed ? "justify-center" : ""}
            `}
            title={collapsed ? "My Profile" : ""}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`
              mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-red-400 hover:bg-red-500/10 hover:text-red-300 transition
              ${collapsed ? "justify-center" : ""}
            `}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm transition-colors">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              ShopHub Admin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Avatar → opens Profile modal */}
            <button
              onClick={() => setProfileOpen(true)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white"
            >
              {user?.username?.[0]?.toUpperCase() || "U"}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
          {children}
        </main>
      </div>

      {/* PROFILE MODAL */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
