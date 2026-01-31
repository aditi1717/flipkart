import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import useAdminAuthStore from '../../admin/store/adminAuthStore';

const Account = () => {
    const navigate = useNavigate();
    const { user, updateProfile, logout: userLogout } = useAuthStore();
    const { adminUser, updateProfile: updateAdminProfile, logout: adminLogout } = useAdminAuthStore();
    const { userProfile } = useCartStore(); // Keep for fallback if needed, but don't use its update
    const [isEditing, setIsEditing] = useState(false);

    // Determine which user to use (admin or regular user)
    const currentUser = adminUser || user;
    const isAdmin = !!adminUser;

    // Local state for editing to avoid direct store mutation before save
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        gender: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                mobile: currentUser.phone || '', // Map phone to mobile for form
                email: currentUser.email || '',
                gender: currentUser.gender || ''
            });
        } else if (userProfile) { // Fallback to local profile
            setFormData({
                name: userProfile.name || '',
                mobile: userProfile.mobile || '',
                email: userProfile.email || '',
                gender: userProfile.gender || ''
            });
        }
    }, [currentUser, userProfile]);

    const handleSave = async () => {
        console.log('Saving profile...', formData);
        try {
            // Use the appropriate update function based on user type
            if (isAdmin) {
                await updateAdminProfile(formData);
            } else if (user) {
                await updateProfile(formData);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            alert(`Failed to save profile: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCancel = () => {
        setFormData(userProfile);
        setIsEditing(false);
    };

    return (
        <div className="bg-background-light min-h-screen pb-20 md:pb-8">
            <div className="max-w-[1440px] mx-auto md:px-4 md:pt-4">
                <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 items-start">

                    {/* DESKTOP SIDEBAR (Left Side) - Strictly Matching Mobile Items */}
                    <div className="hidden md:block md:col-span-4 lg:col-span-3 space-y-4">
                        {/* Identity Card */}
                        <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-3 border border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                <span className="material-icons-outlined text-2xl">person</span>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Hello,</div>
                                <div className="font-bold text-gray-800">{currentUser?.name || userProfile?.name || 'User'}</div>
                            </div>
                        </div>

                        {/* Navigation Menu - Flattened/Grouped to match Mobile Items */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">

                            {/* MY ORDERS */}
                            <div
                                onClick={() => navigate('/my-orders')}
                                className="px-4 py-4 flex items-center justify-between border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3 text-gray-600 font-bold group-hover:text-blue-600">
                                    <span className="material-icons-outlined text-blue-600">inventory_2</span>
                                    <span>MY ORDERS</span>
                                </div>
                                <span className="material-icons-outlined text-gray-400">chevron_right</span>
                            </div>

                            {/* ACCOUNT SETTINGS (Addresses, Language, Notifications) */}
                            <div className="border-b border-gray-100">
                                <div className="flex items-center gap-3 px-4 py-3 text-gray-500 font-medium text-xs uppercase mt-2">
                                    <span className="material-icons-outlined text-[18px]">person</span>
                                    <span>Account Settings</span>
                                </div>
                                <div className="text-sm">
                                    <div onClick={() => navigate('/addresses')} className="px-12 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        Saved Addresses
                                    </div>
                                    <div onClick={() => navigate('/select-language')} className="px-12 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        Select Language
                                    </div>
                                    <div onClick={() => navigate('/notification-settings')} className="px-12 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        Notification Settings
                                    </div>
                                </div>
                            </div>

                            {/* MY STUFF (Wishlist, Coupons, Help) */}
                            <div className="border-b border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase mt-2">
                                    <span className="material-icons-outlined text-[18px]">folder_special</span>
                                    <span>My Stuff</span>
                                </div>
                                <div className="text-sm">
                                    <div onClick={() => navigate('/wishlist')} className="px-12 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        My Wishlist
                                    </div>
                                    <div onClick={() => navigate('/coupons')} className="px-12 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        My Coupons
                                    </div>
                                    <div onClick={() => navigate('/help-center')} className="px-12 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        Help Center
                                    </div>
                                </div>
                            </div>

                            {/* FINANCE OPTIONS (From Mobile Banner) */}
                            <div className="border-b border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase mt-2">
                                    <span className="material-icons-outlined text-[18px]">account_balance_wallet</span>
                                    <span>Finance</span>
                                </div>
                                <div className="text-sm">
                                    <div className="px-12 py-3 text-gray-700 cursor-default flex flex-col">
                                        <span className="font-medium text-green-600">Upto 15% discount</span>
                                        <span className="text-xs text-gray-400">On PhonePe transactions</span>
                                    </div>
                                </div>
                            </div>

                            {/* LEGAL & POLICIES */}
                            <div className="border-b border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase mt-2">
                                    <span className="material-icons-outlined text-[18px]">policy</span>
                                    <span>Legal & Policies</span>
                                </div>
                                <div className="text-sm">
                                    <div onClick={() => navigate('/info?type=privacy')} className="px-12 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        Privacy Policy
                                    </div>
                                    <div onClick={() => navigate('/info?type=about')} className="px-12 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        About Us
                                    </div>
                                </div>
                            </div>

                            {/* Logout */}
                            <div className="py-2">
                                <div
                                    onClick={() => {
                                        if (isAdmin) {
                                            adminLogout();
                                        } else {
                                            userLogout();
                                        }
                                        navigate('/');
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-600 font-semibold hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <span className="material-icons-outlined text-[18px] text-primary">power_settings_new</span>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT (Profile Section) - Center Stage */}
                    <div className="w-full md:col-span-8 lg:col-span-9 md:bg-white md:rounded-lg md:shadow-sm md:border md:border-gray-100 overflow-hidden">
                        {/* Matches existing Profile Section logic but desktop adapted container */}
                        <div className="bg-white px-4 py-6 md:p-8">
                            {/* Desktop Header for Profile Form */}
                            <div className="hidden md:flex items-center gap-4 mb-8">
                                <span className="text-lg font-bold text-gray-800">Personal Information</span>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-sm font-semibold text-blue-600 hover:underline"
                                >
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            {!isEditing ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                            <span className="material-icons-outlined text-3xl">person</span>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">{currentUser?.name || userProfile?.name || 'User'}</h2>
                                            {(user?.phone || userProfile?.mobile) && (
                                                <p className="text-sm text-gray-500">+91 {currentUser?.phone || userProfile?.mobile}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="md:hidden px-4 py-1.5 border border-primary text-primary text-sm font-semibold rounded hover:bg-blue-50 transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full border border-gray-200 rounded p-2 text-sm focus:border-blue-600 outline-none text-gray-900 bg-transparent"
                                            />
                                        </div>
                                        
                                        {/* Only show mobile for regular users, not admins */}
                                        {!user?.isAdmin && (
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Mobile Number</label>
                                                <input
                                                    type="tel"
                                                    value={formData.mobile}
                                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                    className="w-full border border-gray-200 rounded p-2 text-sm focus:border-blue-600 outline-none text-gray-900 bg-transparent"
                                                />
                                            </div>
                                        )}
                                        
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Email ID</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full border border-gray-200 rounded p-2 text-sm focus:border-blue-600 outline-none text-gray-900 bg-transparent"
                                            />
                                        </div>
                                        
                                        {/* Only show gender for regular users, not admins */}
                                        {!isAdmin && (
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Gender</label>
                                                <div className="flex gap-4 mt-1">
                                                    {['Male', 'Female'].map(g => (
                                                        <label key={g} className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                checked={formData.gender === g}
                                                                onChange={() => setFormData({ ...formData, gender: g })}
                                                                className="accent-blue-600"
                                                            />
                                                            <span className="text-sm text-gray-700">{g}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 pt-4 md:pt-6">
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 md:flex-none md:px-8 py-3 text-blue-600 font-bold text-sm border border-blue-600 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 md:flex-none md:px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded shadow-sm"
                                        >
                                            Save Details
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Desktop Only Footer for Profile Card */}
                        <div className="hidden md:block px-8 py-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 font-medium">
                            FAQs?
                        </div>
                    </div>


                    {/* MOBILE LINKS (Hidden on Desktop, Preserved) */}
                    <div className="md:hidden w-full space-y-2 mt-2">
                        {/* Quick Links Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-gray-200 mb-2">
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="bg-white py-4 flex flex-col items-center justify-center gap-1 active:bg-gray-50 transition-colors"
                            >
                                <span className="material-icons-outlined text-primary">inventory_2</span>
                                <span className="text-sm font-medium">Orders</span>
                            </button>
                            <button
                                onClick={() => navigate('/wishlist')}
                                className="bg-white dark:bg-zinc-900 py-4 flex flex-col items-center justify-center gap-1 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors"
                            >
                                <span className="material-icons-outlined text-primary">favorite_border</span>
                                <span className="text-sm font-medium">Wishlist</span>
                            </button>
                            <button
                                onClick={() => navigate('/coupons')}
                                className="bg-white dark:bg-zinc-900 py-4 flex flex-col items-center justify-center gap-1 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors"
                            >
                                <span className="material-icons-outlined text-primary">confirmation_number</span>
                                <span className="text-sm font-medium">Coupons</span>
                            </button>
                            <button
                                onClick={() => navigate('/help-center')}
                                className="bg-white dark:bg-zinc-900 py-4 flex flex-col items-center justify-center gap-1 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors"
                            >
                                <span className="material-icons-outlined text-primary">help_outline</span>
                                <span className="text-sm font-medium">Help Center</span>
                            </button>
                        </div>

                        {/* Finance Options */}
                        <section className="mt-2 bg-white border-t border-b border-gray-100">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h3 className="font-bold text-base">Finance Options</h3>
                            </div>
                            <div className="p-4 flex items-start gap-3">
                                <span className="material-icons-outlined text-green-600 text-2xl mt-1">account_balance_wallet</span>
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">Upto 15% discount</p>
                                    <p className="text-xs text-gray-500 mt-0.5">On every PhonePe transaction</p>
                                </div>
                                <span className="material-icons-outlined text-gray-400 ml-auto self-center">chevron_right</span>
                            </div>
                        </section>

                        {/* Legal & Policies (Mobile) */}
                        <section className="mt-2 bg-white">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                                <h3 className="font-bold text-base">Legal & Policies</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                <div
                                    onClick={() => navigate('/info?type=privacy')}
                                    className="flex items-center justify-between px-4 py-4 active:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons-outlined text-gray-500">privacy_tip</span>
                                        <span className="font-medium">Privacy Policy</span>
                                    </div>
                                    <span className="material-icons-outlined text-gray-400">chevron_right</span>
                                </div>
                                <div
                                    onClick={() => navigate('/info?type=about')}
                                    className="flex items-center justify-between px-4 py-4 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons-outlined text-gray-500">info</span>
                                        <span className="font-medium">About Us</span>
                                    </div>
                                    <span className="material-icons-outlined text-gray-400">chevron_right</span>
                                </div>
                            </div>
                        </section>

                        {/* Account Settings */}
                        <section className="mt-2 bg-white dark:bg-zinc-900">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                                <h3 className="font-bold text-base">Account Settings</h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                                <div
                                    onClick={() => navigate('/addresses')}
                                    className="flex items-center justify-between px-4 py-4 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons-outlined text-gray-500">location_on</span>
                                        <span className="font-medium">Saved Addresses</span>
                                    </div>
                                    <span className="material-icons-outlined text-gray-400">chevron_right</span>
                                </div>
                                <div
                                    onClick={() => navigate('/select-language')}
                                    className="flex items-center justify-between px-4 py-4 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons-outlined text-gray-500">language</span>
                                        <span className="font-medium">Select Language</span>
                                    </div>
                                    <span className="material-icons-outlined text-gray-400">chevron_right</span>
                                </div>
                                <div
                                    onClick={() => navigate('/notification-settings')}
                                    className="flex items-center justify-between px-4 py-4 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons-outlined text-gray-500">notifications</span>
                                        <span className="font-medium">Notification Settings</span>
                                    </div>
                                    <span className="material-icons-outlined text-gray-400">chevron_right</span>
                                </div>
                            </div>
                        </section>

                        {/* Logout button */}
                        <div className="mt-4 px-4 pb-8">
                            <button
                                onClick={() => {
                                    if (isAdmin) {
                                        adminLogout();
                                    } else {
                                        userLogout();
                                    }
                                    navigate('/');
                                }}
                                className="w-full py-3 bg-white text-primary border border-gray-200 font-bold rounded shadow-sm active:bg-gray-50 transition-all"
                            >
                                Log Out
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-6">Version 12.3.4 (4567)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
