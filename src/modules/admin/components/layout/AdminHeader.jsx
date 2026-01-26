import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNotifications, MdLogout, MdPerson } from 'react-icons/md';
import useAdminAuthStore from '../../store/adminAuthStore';

const AdminHeader = () => {
    const navigate = useNavigate();
    const { adminUser, logout } = useAdminAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-black text-white tracking-tight italic">
                    ADMIN <span className="text-blue-500 not-italic">DASHBOARD</span>
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-800 rounded-xl transition-all duration-300 group">
                    <MdNotifications size={24} className="text-gray-400 group-hover:text-blue-500" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
                </button>

                {/* Admin Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-gray-100 leading-none">{adminUser?.name || 'Super Admin'}</p>
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Full Access</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 border border-blue-400/20">
                        <MdPerson size={24} className="text-white" />
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="p-2.5 bg-gray-800/50 hover:bg-red-500 text-gray-400 hover:text-white rounded-xl transition-all duration-300 shadow-inner"
                    title="Logout"
                >
                    <MdLogout size={20} />
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
