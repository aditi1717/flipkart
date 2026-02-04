import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MdPerson, MdInventory2, MdLocationOn, 
    MdFavoriteBorder, MdConfirmationNumber, 
    MdHelpOutline, MdPolicy, 
    MdPowerSettingsNew, MdChevronRight
} from 'react-icons/md';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import useAdminAuthStore from '../../admin/store/adminAuthStore';
import toast from 'react-hot-toast';

const Account = () => {
    const navigate = useNavigate();
    const { user, updateProfile, logout: userLogout } = useAuthStore();
    const { adminUser, updateProfile: updateAdminProfile, logout: adminLogout } = useAdminAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    const currentUser = adminUser || user;
    const isAdmin = !!adminUser;

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
                mobile: currentUser.phone || '',
                email: currentUser.email || '',
                gender: currentUser.gender || ''
            });
        }
    }, [currentUser]);

    const handleSave = async () => {
        try {
            const promise = isAdmin ? updateAdminProfile(formData) : updateProfile(formData);
            await toast.promise(promise, {
                loading: 'Updating profile...',
                success: 'Profile updated successfully!',
                error: (err) => `Update failed: ${err.message}`
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                mobile: currentUser.phone || '',
                email: currentUser.email || '',
                gender: currentUser.gender || ''
            });
        }
    };

    const menuItems = [
        { icon: <MdInventory2 size={22} />, label: 'My Orders', sublabel: 'View your order history', path: '/my-orders', color: '#2874f0' },
        { icon: <MdFavoriteBorder size={22} />, label: 'Wishlist', sublabel: 'Your saved items', path: '/wishlist', color: '#ff6161' },
        { icon: <MdLocationOn size={22} />, label: 'Manage Addresses', sublabel: 'Add or edit addresses', path: '/addresses', color: '#26a541' },
        { icon: <MdConfirmationNumber size={22} />, label: 'Coupons', sublabel: 'View available offers', path: '/coupons', color: '#ff9f00' },
        { icon: <MdHelpOutline size={22} />, label: 'Help Center', sublabel: 'Get support', path: '/help-center', color: '#7a7a7a' },
        { icon: <MdPolicy size={22} />, label: 'Privacy Policy', sublabel: 'Read our policies', path: '/info?type=privacy', color: '#878787' },
    ];

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-24 md:pb-10">
            <div className="max-w-3xl mx-auto md:pt-6 md:px-4">
                
                {/* Profile Card */}
                <div className="bg-white md:rounded-lg shadow-sm">
                    {/* Profile Header */}
                    <div className="p-4 md:p-6 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-[#2874f0] flex items-center justify-center text-white text-xl font-bold">
                                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-semibold text-gray-900 truncate">
                                    {currentUser?.name || 'User'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {currentUser?.phone ? `+91 ${currentUser.phone}` : currentUser?.email || ''}
                                </p>
                            </div>
                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="text-[#2874f0] text-sm font-medium hover:underline"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Edit Form */}
                    {isEditing && (
                        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5 font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5 font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5 font-medium">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        disabled
                                        className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                                        placeholder="Mobile number"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Mobile number cannot be changed</p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 bg-[#2874f0] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#1a5dc8] transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Menu Items */}
                    <div className="divide-y divide-gray-100">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(item.path)}
                                className="flex items-center gap-4 px-4 md:px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                    <p className="text-xs text-gray-500">{item.sublabel}</p>
                                </div>
                                <MdChevronRight size={22} className="text-gray-400" />
                            </div>
                        ))}
                    </div>

                    {/* Logout */}
                    <div className="p-4 md:p-6 border-t border-gray-100">
                        <button
                            onClick={() => {
                                isAdmin ? adminLogout() : userLogout();
                                navigate('/');
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-medium text-sm hover:bg-red-50 rounded-md transition-colors"
                        >
                            <MdPowerSettingsNew size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Account Info Footer */}
                <div className="text-center py-6 px-4">
                    <p className="text-xs text-gray-400">
                        Account created {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : ''}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Account;
