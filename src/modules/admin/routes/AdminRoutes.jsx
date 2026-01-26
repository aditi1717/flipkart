import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import AdminLayout from '../components/layout/AdminLayout';
import Dashboard from '../pages/Dashboard';
import CategoryList from '../pages/Categories/CategoryList';
import BannerManager from '../pages/Homepage/BannerManager';
import PlayManager from '../pages/Play/PlayManager';
import SellerManager from '../pages/Sellers/SellerManager';
import CouponManager from '../pages/Coupons/CouponManager';
import OrderList from '../pages/Orders/OrderList';
import OrderDetail from '../pages/Orders/OrderDetail';
import ReturnRequests from '../pages/Returns/ReturnRequests';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import ProductManager from '../pages/Products/ProductManager';
import ProductForm from '../pages/Products/ProductForm';
import UserList from '../pages/Users/UserList';
import UserDetail from '../pages/Users/UserDetail';
import PageManager from '../pages/PageManager';
import SupportRequests from '../pages/Support/SupportRequests';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="login" element={<AdminLogin />} />

            <Route
                path="/"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout />
                    </ProtectedAdminRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Modules */}
                <Route path="products" element={<ProductManager />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="returns" element={<ReturnRequests />} />
                <Route path="coupons" element={<CouponManager />} />
                <Route path="sellers" element={<SellerManager />} />
                <Route path="play" element={<PlayManager />} />
                <Route path="homepage" element={<BannerManager />} />
                <Route path="users" element={<UserList />} />
                <Route path="users/:id" element={<UserDetail />} />
                <Route path="pages" element={<PageManager />} />
                <Route path="support" element={<SupportRequests />} />
                <Route path="settings" element={<div className="text-2xl font-bold">Settings Page - Coming Soon</div>} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
