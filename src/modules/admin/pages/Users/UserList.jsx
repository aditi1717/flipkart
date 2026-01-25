import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdVisibility, MdBlock, MdCheckCircle, MdMoreVert, MdChevronLeft, MdChevronRight, MdMail, MdPhone, MdShoppingBag } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const UserList = () => {
    const navigate = useNavigate();
    const { users, toggleUserStatus } = useUserStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'All' || user.status === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getStatusStyle = (status) => {
        return status === 'active'
            ? 'bg-green-500/10 text-green-500 border-green-500/20'
            : 'bg-red-500/10 text-red-500 border-red-500/20';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">User Directory</h1>
                    <p className="text-sm text-gray-500 font-medium italic">Monitor and manage registered customer accounts</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <select
                        className="flex-1 lg:flex-none px-6 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold min-w-[150px]"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Disabled">Disabled</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Join Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Orders</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt="" />
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <p className="flex items-center gap-1.5"><MdMail className="text-gray-400" /> {user.email}</p>
                                            <p className="flex items-center gap-1.5 mt-1"><MdPhone className="text-gray-400" /> +91 {user.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                                            {new Date(user.joinedDate).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm">
                                                {user.orderStats.total}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'active'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View Profile"
                                                >
                                                    <MdVisibility size={20} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/orders?user=${user.email}`)}
                                                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="View Orders"
                                                >
                                                    <MdShoppingBag size={20} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const action = user.status === 'active' ? 'Disable' : 'Enable';
                                                        if (window.confirm(`Are you sure you want to ${action.toLowerCase()} account for ${user.name}?`)) {
                                                            toggleUserStatus(user.id);
                                                        }
                                                    }}
                                                    className={`p-2 rounded-lg transition-all ${user.status === 'active'
                                                        ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                        }`}
                                                    title={user.status === 'active' ? 'Disable Account' : 'Enable Account'}
                                                >
                                                    {user.status === 'active' ? <MdBlock size={20} /> : <MdCheckCircle size={20} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-8 py-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        PAGE {currentPage} OF {totalPages}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 disabled:opacity-30 transition-all shadow-sm"
                        >
                            <MdChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 disabled:opacity-30 transition-all shadow-sm"
                        >
                            <MdChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
