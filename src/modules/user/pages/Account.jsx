import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const Account = () => {
    const navigate = useNavigate();
    const { userProfile, updateUserProfile } = useCartStore();
    const [isEditing, setIsEditing] = useState(false);

    // Local state for editing to avoid direct store mutation before save
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        gender: ''
    });

    useEffect(() => {
        if (userProfile) {
            setFormData(userProfile);
        }
    }, [userProfile]);

    const handleSave = () => {
        updateUserProfile(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(userProfile);
        setIsEditing(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-20">
            {/* Profile Section */}
            <div className="bg-white dark:bg-zinc-900 px-4 py-6 border-b border-gray-200 dark:border-zinc-800">
                {!isEditing ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                                <span className="material-icons-outlined text-3xl">person</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold dark:text-white">{userProfile?.name || 'User'}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">+91 {userProfile?.mobile}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-1.5 border border-primary text-primary text-sm font-semibold rounded hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                        >
                            Edit
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-200 rounded p-2 text-sm focus:border-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className="w-full border border-gray-200 rounded p-2 text-sm focus:border-blue-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Email ID</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border border-gray-200 rounded p-2 text-sm focus:border-blue-600 outline-none"
                                />
                            </div>
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
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-3 text-blue-600 font-bold text-sm border border-blue-600 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded shadow-sm"
                            >
                                Save Details
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-2 gap-[1px] bg-gray-200 dark:bg-zinc-800 mb-2">
                <button
                    onClick={() => navigate('/my-orders')}
                    className="bg-white dark:bg-zinc-900 py-4 flex flex-col items-center justify-center gap-1 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors"
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
            <section className="mt-2 bg-white dark:bg-zinc-900 border-t border-b border-gray-100 dark:border-zinc-800">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="font-bold text-base">Finance Options</h3>
                </div>
                <div className="p-4 flex items-start gap-3">
                    <span className="material-icons-outlined text-green-600 text-2xl mt-1">account_balance_wallet</span>
                    <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">Upto 15% discount</p>
                        <p className="text-xs text-gray-500 mt-0.5">On every PhonePe transaction</p>
                    </div>
                    <span className="material-icons-outlined text-gray-400 ml-auto self-center">chevron_right</span>
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
                        useCartStore.getState().logout();
                        navigate('/');
                    }}
                    className="w-full py-3 bg-white dark:bg-zinc-900 text-primary border border-gray-200 dark:border-zinc-800 font-bold rounded shadow-sm active:bg-gray-50 dark:active:bg-zinc-800 transition-all"
                >
                    Log Out
                </button>
                <p className="text-center text-xs text-gray-400 mt-6 dark:text-gray-500">Version 12.3.4 (4567)</p>
            </div>
        </div>
    );
};

export default Account;
