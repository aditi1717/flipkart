import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdFilterList, MdImage, MdVisibility, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import useProductStore from '../../store/productStore';

const ProductManager = () => {
    const navigate = useNavigate();
    const { products, deleteProduct } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Get unique categories for filter
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
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
                    <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                    <p className="text-gray-500 text-sm">Manage inventory, prices, and product details ({filteredProducts.length} total)</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products/new')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                >
                    <MdAdd size={20} /> Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name or brand..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition"
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
                        className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white min-w-[150px]"
                        value={filterCategory}
                        onChange={(e) => {
                            setFilterCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Product Table */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Category</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Price</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-blue-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-blue-50/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                                        {product.image ? (
                                                            <img src={product.image} className="w-full h-full object-contain p-1" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                                <MdImage size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">{product.brand || 'No Brand'}</p>
                                                        <h3 className="text-xs font-bold text-gray-800 truncate max-w-[200px]" title={product.name}>{product.name}</h3>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-black text-gray-500 uppercase">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[13px] font-black text-gray-900">₹{product.price.toLocaleString()}</span>
                                                    {product.originalPrice > product.price && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-[9px] text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                                            <span className="text-[9px] font-bold text-green-500">{product.discount}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-[11px] font-black uppercase tracking-widest ${(product.stock || 0) <= 5 ? 'text-amber-500 animate-pulse' : 'text-blue-600'}`}>
                                                        {product.stock || 0} Units
                                                    </span>
                                                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${(product.stock || 0) <= 5 ? 'bg-amber-500' : 'bg-blue-600'}`}
                                                            style={{ width: `${Math.min(100, (product.stock || 0) * 2)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedProduct(product)}
                                                        className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-green-600 text-gray-400 hover:text-white rounded-xl transition-all shadow-sm border border-transparent hover:border-green-700"
                                                        title="Quick View"
                                                    >
                                                        <MdVisibility size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                        className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-blue-600 text-gray-400 hover:text-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-700"
                                                        title="Edit Product"
                                                    >
                                                        <MdEdit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-red-600 text-gray-400 hover:text-white rounded-xl transition-all shadow-sm border border-transparent hover:border-red-700"
                                                        title="Delete Product"
                                                    >
                                                        <MdDelete size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination UI */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                >
                                    <MdChevronLeft size={24} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === pageNum
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                                            : 'hover:bg-gray-50 text-gray-500'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === currentPage - 2 ||
                                            pageNum === currentPage + 2
                                        ) {
                                            return <span key={pageNum} className="text-gray-300 px-1">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                >
                                    <MdChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Quick View Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="relative p-8">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                            >
                                <MdClose size={24} />
                            </button>

                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-64 h-64 bg-gray-50 rounded-2xl border border-gray-100 p-4 flex-shrink-0">
                                    <img src={selectedProduct.image} className="w-full h-full object-contain" alt="" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{selectedProduct.brand}</p>
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedProduct.name}</h3>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl font-black text-gray-900">₹{selectedProduct.price.toLocaleString()}</div>
                                        {selectedProduct.originalPrice > selectedProduct.price && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-400 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                                                <span className="text-sm font-bold text-green-500">{selectedProduct.discount}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Category</p>
                                            <p className="text-xs font-bold text-gray-800">{selectedProduct.category}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Stock Level</p>
                                            <p className={`text-xs font-bold ${selectedProduct.stock <= 5 ? 'text-amber-500' : 'text-gray-800'}`}>{selectedProduct.stock || 0} Units</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            onClick={() => {
                                                navigate(`/product/${selectedProduct.id}`);
                                                setSelectedProduct(null);
                                            }}
                                            className="flex-1 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                                        >
                                            View on Website
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate(`/admin/products/edit/${selectedProduct.id}`);
                                                setSelectedProduct(null);
                                            }}
                                            className="flex-1 py-3 bg-gray-100 text-gray-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition"
                                        >
                                            Edit Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
