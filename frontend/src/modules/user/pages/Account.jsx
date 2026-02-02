import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MdPerson, MdInventory2, MdLocationOn, MdLanguage, 
    MdNotifications, MdFavoriteBorder, MdConfirmationNumber, 
    MdHelpOutline, MdAccountBalanceWallet, MdPolicy, 
    MdPowerSettingsNew, MdEdit, MdVerified, MdCameraAlt, MdArrowBack
} from 'react-icons/md';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import useAdminAuthStore from '../../admin/store/adminAuthStore';
import toast from 'react-hot-toast';

const Account = () => {
    const navigate = useNavigate();
    const { user, updateProfile, logout: userLogout } = useAuthStore();
    const { adminUser, updateProfile: updateAdminProfile, logout: adminLogout } = useAdminAuthStore();
    const { userProfile } = useCartStore();
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

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-24 md:pb-10 font-sans">
            <div className="max-w-[1248px] mx-auto md:px-4 md:pt-6">
                <div className="flex flex-col md:grid md:grid-cols-12 md:gap-6 items-start">

                    {/* DESKTOP SIDEBAR */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:block md:col-span-4 lg:col-span-3 space-y-4 w-full"
                    >
                        {/* Identity Card */}
                        <div className="bg-white p-4 rounded-xl shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] flex items-center gap-4 transition-all hover:shadow-md border border-white">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                <MdPerson size={32} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Welcome back,</p>
                                <h2 className="font-black text-gray-900 truncate text-lg leading-tight uppercase italic">{currentUser?.name || 'Customer'}</h2>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-xl shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] overflow-hidden border border-white">
                            <div
                                onClick={() => navigate('/my-orders')}
                                className="px-5 py-5 flex items-center justify-between border-b border-gray-50 cursor-pointer hover:bg-blue-50 transition-all group"
                            >
                                <div className="flex items-center gap-4 text-gray-700 font-black tracking-tight group-hover:text-blue-600 uppercase italic">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <MdInventory2 size={20} />
                                    </div>
                                    <span>My Orders</span>
                                </div>
                                <span className="material-icons text-gray-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>

                            {[
                                { 
                                    title: 'Account Settings', 
                                    icon: <MdPerson />, 
                                    items: [
                                        { label: 'Saved Addresses', path: '/addresses' },
                                        { label: 'Language Settings', path: '/select-language' },
                                        { label: 'Notifications', path: '/notification-settings' }
                                    ] 
                                },
                                { 
                                    title: 'My Collections', 
                                    icon: <MdFavoriteBorder />, 
                                    items: [
                                        { label: 'My Wishlist', path: '/wishlist' },
                                        { label: 'Coupons & Offers', path: '/coupons' },
                                        { label: 'Help & Support', path: '/help-center' }
                                    ] 
                                }
                            ].map((section, idx) => (
                                <div key={idx} className="border-b border-gray-50 pb-2">
                                    <div className="flex items-center gap-4 px-5 py-4 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2 italic">
                                        {section.icon}
                                        <span>{section.title}</span>
                                    </div>
                                    <div className="space-y-1">
                                        {section.items.map((item, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => navigate(item.path)} 
                                                className="px-14 py-3 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-all border-l-4 border-transparent hover:border-blue-600"
                                            >
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="p-3">
                                <button
                                    onClick={() => {
                                        isAdmin ? adminLogout() : userLogout();
                                        navigate('/');
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-4 text-red-500 font-black uppercase italic tracking-wider hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <MdPowerSettingsNew size={22} />
                                    <span>Logout Account</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* MAIN CONTENT */}
                    <div className="w-full md:col-span-8 lg:col-span-9">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white md:rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-white overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-[#2874f0] to-[#1e5bbd] px-6 py-10 md:px-10 md:py-14 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
                                
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="relative group">
                                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-white rotate-3 transition-transform group-hover:rotate-0">
                                            <img 
                                                src={currentUser?.avatar || 'https://www.w3schools.com/howto/img_avatar.png'} 
                                                className="w-full h-full object-cover -rotate-3 transition-transform group-hover:rotate-0 scale-110" 
                                                alt="" 
                                            />
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90">
                                            <MdCameraAlt size={20} />
                                        </button>
                                    </div>
                                    
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-3">
                                            <h1 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                                                {currentUser?.name || 'Customer Profile'}
                                            </h1>
                                            <MdVerified size={24} className="text-blue-300" />
                                        </div>
                                        <p className="text-blue-100 font-bold mt-2 uppercase tracking-[0.2em] text-[10px] italic flex items-center justify-center md:justify-start gap-2">
                                            {isAdmin ? 'System Administrator' : 'Privileged Member'}
                                            <span className="w-8 h-0.5 bg-blue-300/30 rounded-full"></span>
                                            Since {new Date(currentUser?.joinedDate || currentUser?.createdAt).getFullYear()}
                                        </p>
                                    </div>

                                    {!isEditing && (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="md:ml-auto px-8 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white font-black uppercase italic text-[11px] rounded-2xl tracking-[0.3em] hover:bg-white hover:text-blue-600 transition-all active:scale-95"
                                        >
                                            Edit Details
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 md:p-12 lg:p-16">
                                <AnimatePresence mode="wait">
                                    {!isEditing ? (
                                        <motion.div 
                                            key="view"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16"
                                        >
                                            {[
                                                { label: 'Personal Name', value: currentUser?.name, icon: <MdPerson />, color: 'blue' },
                                                { label: 'Communication Email', value: currentUser?.email, icon: <MdMail size={20} />, color: 'violet' },
                                                { label: 'Mobile Contact', value: `+91 ${currentUser?.phone || 'N/A'}`, icon: <MdPhone size={20} />, color: 'emerald' },
                                                { label: 'Account Type', value: isAdmin ? 'Administrator' : 'General Customer', icon: <MdPolicy size={20} />, color: 'amber' }
                                            ].map((item, idx) => (
                                                <div key={idx} className="group">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-inner`}>
                                                            {item.icon}
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.label}</span>
                                                    </div>
                                                    <p className="text-xl font-black text-gray-900 ml-14 tracking-tight transition-colors group-hover:text-blue-600 block leading-none italic uppercase">
                                                        {item.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="edit"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            className="space-y-8"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block italic">Real Identity Name</label>
                                                    <div className="relative">
                                                        <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 text-sm font-black italic text-gray-900 focus:bg-white focus:border-blue-600 focus:shadow-xl outline-none transition-all uppercase"
                                                            placeholder="Full Name"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block italic">Restricted Mobile Contact</label>
                                                    <div className="relative">
                                                        <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                        <input
                                                            type="tel"
                                                            value={formData.mobile}
                                                            disabled
                                                            className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 pl-12 text-sm font-black italic text-gray-300 outline-none cursor-not-allowed uppercase"
                                                            placeholder="Phone Number"
                                                        />
                                                    </div>
                                                    <p className="text-[9px] font-bold text-gray-400 mt-2 ml-1 italic capitalize">Contact number verification is required to change this</p>
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block italic">Verified Email Destination</label>
                                                    <div className="relative">
                                                        <MdMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 text-sm font-black italic text-gray-900 focus:bg-white focus:border-blue-600 focus:shadow-xl outline-none transition-all uppercase"
                                                            placeholder="Email Address"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4 pt-10">
                                                <button
                                                    onClick={handleSave}
                                                    className="flex-1 bg-gray-900 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase italic tracking-[0.4em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                                                >
                                                    Execute Updates
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="px-12 py-5 bg-white text-gray-400 border border-gray-100 rounded-[1.5rem] text-[11px] font-black uppercase italic tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95"
                                                >
                                                    Abandon
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    {/* MOBILE LINKS */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden w-full space-y-4 px-4 mt-6 pb-10"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Orders', icon: <MdInventory2 />, path: '/my-orders' },
                                { label: 'Wishlist', icon: <MdFavoriteBorder />, path: '/wishlist' },
                                { label: 'Coupons', icon: <MdConfirmationNumber />, path: '/coupons' },
                                { label: 'Support', icon: <MdHelpOutline />, path: '/help-center' }
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(item.path)}
                                    className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all active:bg-blue-50 border border-white"
                                >
                                    <div className="text-blue-600 scale-125">{item.icon}</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-white">
                            {[
                                { label: 'Saved Addresses', icon: <MdLocationOn />, path: '/addresses' },
                                { label: 'Language Options', icon: <MdLanguage />, path: '/select-language' },
                                { label: 'System Policies', icon: <MdPolicy />, path: '/info?type=privacy' }
                            ].map((item, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => navigate(item.path)}
                                    className="flex items-center justify-between p-6 border-b border-gray-50 last:border-0 active:bg-blue-50 transition-colors"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="text-gray-400">{item.icon}</div>
                                        <span className="text-sm font-black uppercase italic tracking-tighter text-gray-700">{item.label}</span>
                                    </div>
                                    <MdArrowBack size={20} className="rotate-180 text-gray-300" />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                isAdmin ? adminLogout() : userLogout();
                                navigate('/');
                            }}
                            className="w-full py-6 bg-white text-red-500 font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-sm border border-red-50 flex items-center justify-center gap-3 active:scale-95 transition-all italic text-[11px]"
                        >
                            <MdPowerSettingsNew size={20} />
                            Log Out Session
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Simplified icon component mappings since some were missing in original scope
const MdMail = ({ size = 24 }) => <span className="material-icons-outlined" style={{ fontSize: size }}>mail</span>;
const MdPhone = ({ size = 24 }) => <span className="material-icons-outlined" style={{ fontSize: size }}>phone</span>;

export default Account;
