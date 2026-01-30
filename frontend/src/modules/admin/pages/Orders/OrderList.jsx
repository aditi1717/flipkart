import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdSearch, MdFilterList, MdVisibility, MdChevronLeft, MdChevronRight, MdLocalShipping, MdCheckCircle, MdPendingActions, MdCancel } from 'react-icons/md';
import useOrderStore from '../../store/orderStore';
import Pagination from '../../components/common/Pagination';

const OrderList = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userEmailFilter = searchParams.get('user');

    const { orders } = useOrderStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

        const matchesUserFilter = !userEmailFilter || order.user.email.toLowerCase() === userEmailFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesUserFilter;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <MdPendingActions size={14} />;
            case 'Confirmed': return <MdCheckCircle size={14} />;
            case 'Shipped': return <MdLocalShipping size={14} />;
            case 'Delivered': return <MdCheckCircle size={14} />;
            case 'Cancelled': return <MdCancel size={14} />;
            default: return null;
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Management</h1>
                    <p className="text-sm text-gray-500 font-medium italic">Monitor sales and update fulfillment status ({filteredOrders.length} total)</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name..."
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <MdFilterList className="text-gray-400" size={20} />
                    <select
                        className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold min-w-[150px] appearance-none"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <MdLocalShipping size={32} />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No orders found matching your criteria</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID & Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">CustomerDetails</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items & Price</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Payment</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-blue-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-blue-50/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors">{order.id}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                                                        {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-800">{order.user.name}</span>
                                                    <div className="flex flex-col mt-0.5 gap-0.5">
                                                        <span className="text-[10px] text-gray-400 font-medium tracking-tight hover:text-blue-500 transition-colors cursor-pointer">{order.user.email}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium tracking-tight">{order.user.phone}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Product Thumbnails */}
                                                    <div className="flex -space-x-2 overflow-hidden items-center">
                                                        {order.items.slice(0, 3).map((item, idx) => (
                                                            <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex-shrink-0">
                                                                <img 
                                                                    src={item.image} 
                                                                    alt={item.name} 
                                                                    className="h-full w-full object-cover rounded-full"
                                                                />
                                                            </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-50 flex items-center justify-center text-[9px] font-bold text-gray-500 z-10">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-col">
                                                        <span className="text-[13px] font-black text-gray-900">₹{order.total.toLocaleString()}</span>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase">{order.payment.method}</span>
                                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${order.payment.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                        {order.payment.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter shadow-sm ${getStatusStyle(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                    className="w-10 h-10 inline-flex items-center justify-center bg-gray-50 hover:bg-blue-600 text-gray-400 hover:text-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-700"
                                                    title="View Details"
                                                >
                                                    <MdVisibility size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderList;
