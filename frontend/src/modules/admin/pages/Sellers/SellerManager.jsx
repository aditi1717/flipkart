
import React, { useState } from 'react';
import { MdCheckCircle, MdCancel, MdDelete, MdSearch, MdStore, MdLocationOn, MdPhone, MdEmail, MdVisibility, MdClose, MdContentCopy, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import useSellerStore from '../../store/sellerStore';

const SellerManager = () => {
    const { sellers, approveSeller, rejectSeller, deleteSeller } = useSellerStore();
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [selectedSeller, setSelectedSeller] = useState(null);

    const filteredSellers = sellers.filter(seller => {
        const matchesStatus = filterStatus === 'All' ? true : seller.status === filterStatus.toLowerCase();
        const matchesSearch =
            seller.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.contactNumber.includes(searchTerm);

        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSellers = filteredSellers.slice(startIndex, startIndex + itemsPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleAction = (action, id) => {
        if (action === 'approve') approveSeller(id);
        if (action === 'reject') rejectSeller(id);
        if (selectedSeller && selectedSeller.id === id) {
            setSelectedSeller(prev => ({ ...prev, status: action === 'approve' ? 'approved' : 'rejected' }));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Seller Applications</h1>
                    <p className="text-gray-500 text-sm">Manage pending approvals and active sellers</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by ID, Brand or Phone..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 w-64"
                        />
                        <MdSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Sellers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">Reg. No</th>
                            <th className="p-4 font-semibold">Brand / Deal Info</th>
                            <th className="p-4 font-semibold">Contact</th>
                            <th className="p-4 font-semibold">GST Number</th>
                            <th className="p-4 font-semibold text-center">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                        {paginatedSellers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No sellers found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            paginatedSellers.map(seller => (
                                <tr key={seller.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-mono font-medium text-blue-600">{seller.registrationNumber}</td>
                                    <td className="p-4 font-bold text-gray-800">{seller.brandName}</td>
                                    <td className="p-4">
                                        <p className="flex items-center gap-1"><MdPhone size={14} className="text-gray-400" /> {seller.contactNumber}</p>
                                        <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5"><MdEmail size={14} className="text-gray-400" /> {seller.emailId}</p>
                                    </td>
                                    <td className="p-4 font-mono">{seller.gstNumber}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(seller.status)}`}>
                                            {seller.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => setSelectedSeller(seller)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                                            title="View Details"
                                        >
                                            <MdVisibility size={20} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Delete this seller record permanently?')) deleteSeller(seller.id)
                                            }}
                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                                            title="Delete"
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-8 py-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        PAGE {currentPage} OF {totalPages}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 disabled:opacity-30 transition-all shadow-sm"
                        >
                            <MdChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 disabled:opacity-30 transition-all shadow-sm"
                        >
                            <MdChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Seller Details Modal */}
            {selectedSeller && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Submitted on {selectedSeller.joinedDate}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedSeller(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition"
                            >
                                <MdClose size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body - Matching Screenshot Fields */}
                        <div className="p-6 space-y-6">

                            {/* Registration Number */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Seller Registration Number</label>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-mono font-medium">
                                    {selectedSeller.registrationNumber}
                                </div>
                            </div>

                            {/* Brand Name */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Brand Name / Deal</label>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-bold text-lg">
                                    {selectedSeller.brandName}
                                </div>
                            </div>

                            {/* Contact Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Contact Number</label>
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                                        +91 {selectedSeller.contactNumber}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Email ID</label>
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium truncate" title={selectedSeller.emailId}>
                                        {selectedSeller.emailId}
                                    </div>
                                </div>
                            </div>

                            {/* GST Number */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">GST Number</label>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-mono font-medium flex justify-between items-center">
                                    {selectedSeller.gstNumber}
                                    <MdContentCopy className="text-gray-400 cursor-pointer hover:text-blue-500" title="Copy" />
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center justify-between pt-2">
                                <span className="font-semibold text-gray-600">Current Status:</span>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase ${getStatusColor(selectedSeller.status)}`}>
                                    {selectedSeller.status}
                                </span>
                            </div>

                        </div>

                        {/* Modal Footer (Actions) */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                            {selectedSeller.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => handleAction('approve', selectedSeller.id)}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                                    >
                                        <MdCheckCircle size={20} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction('reject', selectedSeller.id)}
                                        className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition flex items-center justify-center gap-2"
                                    >
                                        <MdCancel size={20} /> Reject
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setSelectedSeller(null)}
                                    className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                                >
                                    Close Details
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerManager;

