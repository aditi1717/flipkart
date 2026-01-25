import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MdArrowBack, MdMail, MdPhone, MdLocationOn, MdCalendarToday,
    MdShoppingBag, MdCheckCircle, MdBlock, MdHistory,
    MdPendingActions, MdLocalShipping, MdCancel, MdTrendingUp
} from 'react-icons/md';
import useUserStore from '../../store/userStore';
import useOrderStore from '../../store/orderStore';
import useReturnStore from '../../store/returnStore';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { users, toggleUserStatus } = useUserStore();
    const { orders } = useOrderStore();
    const { returns } = useReturnStore();
    const [activeTab, setActiveTab] = useState('All');

    const user = users.find(u => u.id === id);
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
                <MdBlock size={64} className="text-gray-200 mb-4" />
                <h2 className="text-xl font-black italic uppercase tracking-widest">User Not Found</h2>
                <button onClick={() => navigate('/admin/users')} className="mt-4 text-blue-600 font-bold hover:underline">Back to Directory</button>
            </div>
        );
    }

    // Filter orders for this user
    const userOrders = orders.filter(order => order.user.email.toLowerCase() === user.email.toLowerCase());

    // Filter returns for this user (using name for now as mock data uses name)
    const userReturns = returns.filter(ret => ret.customer.toLowerCase() === user.name.toLowerCase());

    const filteredItems = (() => {
        let items = [];
        if (activeTab === 'Returns') {
            items = userReturns;
        } else if (activeTab === 'All') {
            items = [...userOrders, ...userReturns];
        } else {
            items = userOrders.filter(order => order.status === activeTab);
        }
        return items.sort((a, b) => new Date(b.date) - new Date(a.date));
    })();

    const stats = [
        { label: 'Total Orders', value: user.orderStats.total, icon: MdShoppingBag, color: 'blue' },
        { label: 'Completed', value: user.orderStats.completed, icon: MdCheckCircle, color: 'green' },
        { label: 'Pending', value: user.orderStats.pending, icon: MdPendingActions, color: 'amber' },
        { label: 'Total Spent', value: `₹${user.financials.totalSpent.toLocaleString()}`, icon: MdTrendingUp, color: 'indigo' },
    ];

    const tabs = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returns'];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            case 'Pickup Scheduled': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Approved': return 'bg-teal-50 text-teal-600 border-teal-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header / Back Navigation */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100 shadow-sm hover:shadow"
                >
                    <MdArrowBack size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Customer Profile</h1>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">Internal ID: {user.id}</p>
                </div>
            </div>

            {/* Top Section: Profile Info & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Profile Information */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 pb-4 text-center">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl mx-auto rotate-3">
                                <img src={user.avatar} className="w-full h-full object-cover -rotate-3" alt="" />
                            </div>
                            <span className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mt-6 tracking-tight">{user.name}</h2>
                        <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'bg-green-50/50 text-green-600 border-green-100' : 'bg-red-50/50 text-red-600 border-red-100'
                            }`}>
                            {user.status} account
                        </div>
                    </div>

                    <div className="p-8 pt-4 space-y-4 border-t border-gray-50 bg-gray-50/30">
                        <div className="flex items-start gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:scale-[1.02]">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                <MdMail size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Primary Email</p>
                                <p className="text-xs font-bold text-gray-800 mt-1 truncate">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:scale-[1.02]">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                                <MdPhone size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Phone Contact</p>
                                <p className="text-xs font-bold text-gray-800 mt-1">+91 {user.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:scale-[1.02]">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                                <MdLocationOn size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Default Address</p>
                                <p className="text-xs font-bold text-gray-700 mt-1 leading-relaxed">{user.address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:scale-[1.02]">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                                <MdCalendarToday size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Member Since</p>
                                <p className="text-xs font-bold text-gray-800 mt-1">
                                    {new Date(user.joinedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4 shadow-sm border ${user.status === 'active'
                                ? 'bg-red-500 text-white border-red-600 hover:bg-red-600 shadow-red-200'
                                : 'bg-green-500 text-white border-green-600 hover:bg-green-600 shadow-green-200'
                                }`}
                        >
                            {user.status === 'active' ? <><MdBlock size={18} /> Disable Account</> : <><MdCheckCircle size={18} /> Enable Account</>}
                        </button>
                    </div>
                </div>

                {/* Stats & History */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:scale-105 transition-all">
                                    <div className={`w-12 h-12 rounded-2xl mb-3 flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-500 group-hover:bg-${stat.color}-500 group-hover:text-white transition-colors`}>
                                        <Icon size={24} />
                                    </div>
                                    <p className="text-lg font-black text-gray-900 leading-none">{stat.value}</p>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Activity Section */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
                        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                                    <MdHistory size={20} />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                                    {activeTab === 'Returns' ? 'Return Requests' : 'Order Activity'}
                                </h3>
                            </div>

                            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab
                                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto max-h-[600px] space-y-4">
                            {filteredItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                    <MdShoppingBag size={48} className="mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest italic">No {activeTab === 'Returns' ? 'returns' : 'orders'} found in this category</p>
                                </div>
                            ) : (
                                filteredItems.map(item => {
                                    const isReturn = item.type === 'Return' || item.type === 'Replacement';
                                    return (
                                        <div key={item.id} className="p-4 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-6 hover:bg-white hover:shadow-lg hover:scale-[1.01] transition-all group">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic">{item.id}</span>
                                                        {isReturn && (
                                                            <span className="ml-2 text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                                {item.type}
                                                            </span>
                                                        )}
                                                        <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">
                                                            {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tighter ${getStatusStyle(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {isReturn ? (
                                                        <>
                                                            <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-white flex-shrink-0">
                                                                <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p>
                                                                <p className="text-[9px] font-bold text-red-500 mt-0.5 uppercase tracking-wide">Reason: {item.reason}</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex -space-x-2 overflow-hidden">
                                                            {item.items.map((prod, idx) => (
                                                                <div key={idx} className="w-10 h-10 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-white">
                                                                    <img src={prod.image} className="w-full h-full object-cover" alt="" />
                                                                </div>
                                                            ))}
                                                            {item.items.length > 3 && (
                                                                <div className="w-10 h-10 rounded-lg border-2 border-white shadow-sm bg-gray-900 text-white flex items-center justify-center text-[10px] font-black">
                                                                    +{item.items.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="md:w-px h-px md:h-20 bg-gray-100"></div>

                                            <div className="flex flex-col justify-center items-end text-right min-w-[120px]">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">
                                                    {isReturn ? (item.type === 'Return' ? 'Refund Amount' : 'Original Value') : 'Total Amount'}
                                                </p>
                                                <p className="text-md font-black text-gray-900 mt-1 tracking-tighter">
                                                    ₹{(isReturn ? item.product.price : item.total).toLocaleString()}
                                                </p>
                                                <button
                                                    onClick={() => navigate(isReturn ? `/admin/returns` : `/admin/orders/${item.id}`)}
                                                    className="mt-3 text-[9px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-widest"
                                                >
                                                    Details <MdArrowBack className="rotate-180" size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
