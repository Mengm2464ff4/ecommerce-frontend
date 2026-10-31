import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import Navbar from "../components/common/Navbar";
import SubNavbar from "../components/common/SubNavbar";
import Footer from "../components/common/Footer";
import AdminLayout from "../components/auth/admin/AdminLayout";
import TrustBar from "../components/common/TrustBar";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Categories from "../pages/Categories";
import Deals from "../pages/Deals";
import ShippingInfo from "../pages/ShippingInfo";
import Returns from "../pages/Returns";
import TrackOrder from "../pages/TrackOrder";
import Cookies from "../pages/Cookies";
import RefundPolicy from "../pages/RefundPolicy";
import OrderSuccess from "../pages/OrderSuccess";
import OrderCancel from "../pages/OrderCancel";
import Payment from "../pages/Payment";
import Wishlist from "../pages/Wishlist";
import OrderDetail from "../pages/OrderDetail";
import ForgotPassword from "../components/auth/ForgotPassword";
import VerifyEmail from "../pages/VerifyEmail";
import Profile from "../pages/Profile"; // 👈 Adjust the path if your Profile.jsx is in a different folder

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ResetPassword from "../components/auth/ResetPassword";

import Dashboard from "../pages/Admin/Dashboard";
import AdminProducts from "../pages/Admin/Products";
import AdminCategories from "../pages/Admin/Categories";
import AdminOrders from "../pages/Admin/Orders";
import AdminUsers from "../pages/Admin/Users";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= ADMIN ================= */}
      <Route element={<AdminRoute />}>
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<AdminProducts />} />
                <Route path="/categories" element={<AdminCategories />} />
                <Route path="/orders" element={<AdminOrders />} />
                <Route path="/users" element={<AdminUsers />} />
              </Routes>
            </AdminLayout>
          }
        />
      </Route>
      {/* ================================================= */}
      {/* AUTH PAGES - STANDALONE (No Navbar / SubNavbar)   */}
      {/* ================================================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />{" "}
      {/* 👈 ADD THIS */}
      {/* ================================================= */}
      {/* MY ORDERS - STANDALONE PAGE                       */}
      {/* ================================================= */}
      <Route element={<PrivateRoute />}>
        <Route path="/orders" element={<Orders />} />
      </Route>
      {/* ================================================= */}
      {/* OTHER PRIVATE PAGES                                */}
      {/* ================================================= */}
      <Route element={<PrivateRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/wishlist" element={<Wishlist />} />
         <Route path="/profile" element={<Profile />} /> {/* 👈 ADD THIS */}
      </Route>
      {/* ================= PUBLIC ================= */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
            <Navbar />
            <SubNavbar />
            <TrustBar />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/shipping" element={<ShippingInfo />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/refund" element={<RefundPolicy />} />
                <Route path="/order/success" element={<OrderSuccess />} />
                <Route path="/order/cancel" element={<OrderCancel />} />

                {/* ❌ REMOVED from here — moved above to standalone group */}
                {/* <Route path="/login" element={<Login />} /> */}
                {/* <Route path="/register" element={<Register />} /> */}
              </Routes>
            </main>

            <Footer />
          </div>
        }
      />
    </Routes>
  );
}
