import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/app/layouts/AdminLayout";
import UserLayout from "@/app/layouts/UserLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import LoginPage from "@/features/auth/pages/LoginPage";
import HomePage from "@/features/home/pages/HomePage";
import ProductAccountManager from "@/features/admin/productAccounts/pages/ProductAccountManager";
import NetflixGetCodePage from "@/features/tempmail/pages/NetflixGetCodePage";
import NetflixUpdateHouseMailPage from "@/features/tempmail/pages/NetflixUpdateHouseMailPage";
import OrderLookUpPage from "@/features/orders/pages/OrderLookUpPage";
import AdminCouponsPage from "@/pages/admin/AdminCouponsPage";
import AdminProductCreatePage from "@/pages/admin/AdminProductCreatePage";
import AdminProductEditPage from "@/pages/admin/AdminProductEditPage";
import AdminProductListPage from "@/pages/admin/AdminProductListPage";
import AdminProductOrdersPage from "@/pages/admin/AdminProductOrdersPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import ProductDetailPage from "@/pages/client/ProductDetailPage";
import ProductListPage from "@/pages/client/ProductListPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<UserLayout />}>
          <Route index element={<Navigate to="/product" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/netflix-mail" element={<NetflixUpdateHouseMailPage />} />
          <Route path="/product" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/netflix-code" element={<NetflixGetCodePage />} />
          <Route path="/order-lookup" element={<OrderLookUpPage />} />
        </Route>

        <Route element={<ProtectedRoute requireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin-create-product" element={<AdminProductCreatePage />} />
            <Route path="/admin-product-list" element={<AdminProductListPage />} />
            <Route path="/admin/product-orders" element={<AdminProductOrdersPage />} />
            <Route path="/admin/discounts" element={<AdminCouponsPage />} />
            <Route
              path="/admin-products/:productId/edit"
              element={<AdminProductEditPage />}
            />
            <Route
              path="/admin-product-account/:productId"
              element={<ProductAccountManager />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/product" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
