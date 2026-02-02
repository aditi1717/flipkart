import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import AdminLayout from '../components/layout/AdminLayout';
import Dashboard from '../pages/Dashboard';
import CategoryList from '../pages/Categories/CategoryList';
import SubCategoryList from '../pages/SubCategories/SubCategoryList';
import BannerManager from '../pages/Homepage/BannerManager';
import PlayManager from '../pages/Play/PlayManager';
import CouponManager from '../pages/Coupons/CouponManager';
import OrderList from '../pages/Orders/OrderList';
import OrderDetail from '../pages/Orders/OrderDetail';
import DeliverySlip from '../pages/DeliverySlip/DeliverySlip';
import ReturnRequests from '../pages/Returns/ReturnRequests';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import ProductManager from '../pages/Products/ProductManager';
import ProductForm from '../pages/Products/ProductForm';
import UserList from '../pages/Users/UserList';
import UserDetail from '../pages/Users/UserDetail';
import PageManager from '../pages/PageManager';
import SupportRequests from '../pages/Support/SupportRequests';
import HomeContentManager from '../pages/Content/HomeContentManager';
import ReviewList from '../pages/Reviews/ReviewList';
import PinCodeManager from '../pages/PinCodes/PinCodeManager';
import BankOfferManager from '../pages/BankOffers/BankOfferManager';
import SettingsPage from '../pages/Settings/SettingsPage';

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
                <Route path="subcategories" element={<SubCategoryList />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="delivery-slip" element={<DeliverySlip />} />
                <Route path="returns" element={<ReturnRequests />} />
                <Route path="reviews" element={<ReviewList />} />
                <Route path="coupons" element={<CouponManager />} />
                <Route path="play" element={<PlayManager />} />
                <Route path="homepage" element={<BannerManager />} />
                <Route path="users" element={<UserList />} />
                <Route path="users/:id" element={<UserDetail />} />
                <Route path="pages" element={<PageManager />} />
                <Route path="content/home" element={<HomeContentManager />} />
                <Route path="content/banners" element={<HomeContentManager />} />
                <Route path="pincodes" element={<PinCodeManager />} />
                <Route path="bank-offers" element={<BankOfferManager />} />
                <Route path="support" element={<SupportRequests />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
