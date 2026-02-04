import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdToggleOn,
    MdToggleOff,
    MdFilterList,
    MdSearch,
    MdLabel
} from 'react-icons/md';
import toast from 'react-hot-toast';
import useOfferStore from '../../store/offerStore';

const OfferList = () => {
    const navigate = useNavigate();
    const { offers, fetchOffers, deleteOffer, toggleOfferStatus, isLoading } = useOfferStore();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [applicableToFilter, setApplicableToFilter] = useState('all');

    useEffect(() => {
        fetchOffers();
    }, []);

    const filteredOffers = offers.filter((offer) => {
        const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && offer.isActive) ||
            (statusFilter === 'inactive' && !offer.isActive);
        const matchesType = applicableToFilter === 'all' || offer.applicableTo === applicableToFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                await deleteOffer(id);
            } catch (error) {
                toast.error('Failed to delete offer');
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleOfferStatus(id);
        } catch (error) {
            toast.error('Failed to toggle offer status');
        }
    };

    const getDiscountDisplay = (offer) => {
        if (offer.discountType === 'percentage') {
            return `${offer.discountValue}% OFF`;
        }
        return `₹${offer.discountValue} OFF`;
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="px-3 py-1 text-xs font-bold  bg-green-100 text-green-700  rounded-full">
                Active
            </span>
        ) : (
            <span className="px-3 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded-full">
                Inactive
            </span>
        );
    };

    const getApplicableToBadge = (type) => {
        const colors = {
            product: 'bg-blue-100 text-blue-700',
            category: 'bg-purple-100 text-purple-700',
            subcategory: 'bg-orange-100 text-orange-700'
        };
        
        return (
            <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${colors[type]}`}>
                {type}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Offers Management</h1>
                    <p className="text-sm text-gray-500 font-medium italic">
                        Create and manage promotional offers ({filteredOffers.length} offers)
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/offers/add')}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                    <MdAdd size={20} />
                    Add New Offer
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search offers by title..."
                            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400 caret-blue-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-3">
                        <MdFilterList className="text-gray-400" size={20} />
                        <select
                            className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold text-gray-900 min-w-[140px]"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Type Filter */}
                    <select
                        className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold text-gray-900 min-w-[160px]"
                        value={applicableToFilter}
                        onChange={(e) => setApplicableToFilter(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="product">Product</option>
                        <option value="category">Category</option>
                        <option value="subcategory">Subcategory</option>
                    </select>
                </div>
            </div>

            {/* Offers Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredOffers.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <MdLabel size={32} />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        No offers found
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-blue-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOffers.map((offer) => (
                                    <tr key={offer._id} className="hover:bg-blue-50/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {offer.title}
                                                </span>
                                                {offer.description && (
                                                    <span className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                        {offer.description}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-green-600">
                                                {getDiscountDisplay(offer)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getApplicableToBadge(offer.applicableTo)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-xs text-gray-600">
                                                <span className="font-bold">
                                                    {new Date(offer.startDate).toLocaleDateString('en-IN')}
                                                </span>
                                                <span className="text-gray-400">to</span>
                                                <span className="font-bold">
                                                    {new Date(offer.endDate).toLocaleDateString('en-IN')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(offer.isActive)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(offer._id)}
                                                    className={`p-2 rounded-lg border transition-all ${
                                                        offer.isActive
                                                            ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                                    title={offer.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {offer.isActive ? <MdToggleOn size={20} /> : <MdToggleOff size={20} />}
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/offers/edit/${offer._id}`)}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-all"
                                                    title="Edit"
                                                >
                                                    <MdEdit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(offer._id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-all"
                                                    title="Delete"
                                                >
                                                    <MdDelete size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferList;
