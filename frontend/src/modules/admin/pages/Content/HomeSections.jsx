import React, { useState, useEffect } from 'react';
import {
    MdEdit,
    MdSave,
    MdClose,
    MdAdd,
    MdDelete,
    MdSearch,
    MdVisibility,
    MdArrowBack,
    MdInventory
} from 'react-icons/md';
import { useContentStore } from '../../store/contentStore';
import useProductStore from '../../store/productStore';

const HomeSections = () => {
    const {
        homeSections,
        updateSectionTitle,
        createHomeSection,
        deleteHomeSection,
        addProductToSection,
        removeProductFromSection,
        fetchHomeSections
    } = useContentStore();
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchHomeSections();
        fetchProducts();
    }, [fetchHomeSections, fetchProducts]);

    // Navigation State
    const [selectedSectionId, setSelectedSectionId] = useState(null);

    // Creates State
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newSectionData, setNewSectionData] = useState({ title: '', id: '' });

    // UI State
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [showProductModal, setShowProductModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const activeSection = homeSections.find(s => s.id === selectedSectionId);

    const handleCreate = async () => {
        if (!newSectionData.title || !newSectionData.id) return;
        // Simple sanitization for ID
        const finalId = newSectionData.id.toLowerCase().replace(/\s+/g, '_');
        await createHomeSection({ ...newSectionData, id: finalId });
        setShowCreateForm(false);
        setNewSectionData({ title: '', id: '' });
    };

    const handleDeleteSection = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this section?')) {
             await deleteHomeSection(id);
             if (selectedSectionId === id) setSelectedSectionId(null);
        }
    };

    const handleEditTitleOpen = () => {
        setNewTitle(activeSection.title);
        setIsEditingTitle(true);
    };

    const handleSaveTitle = () => {
        updateSectionTitle(activeSection.id, newTitle);
        setIsEditingTitle(false);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Main List View (Highly Compact) ---
    if (!selectedSectionId) {
        return (
            <div className="space-y-4">
                 {/* Create Form */}
                 {showCreateForm && (
                     <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-in slide-in-from-top-2">
                         <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Create New Section</h3>
                         <div className="flex gap-4">
                             <div className="flex-1 space-y-1">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase">Section ID (Unique)</label>
                                 <input 
                                    type="text" 
                                    placeholder="e.g. summer_sale" 
                                    value={newSectionData.id} 
                                    onChange={(e) => setNewSectionData({...newSectionData, id: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm font-normal text-gray-800 outline-none focus:bg-white focus:ring-2 ring-blue-100 transition"
                                 />
                             </div>
                             <div className="flex-[2] space-y-1">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase">Display Title</label>
                                 <input 
                                    type="text" 
                                    placeholder="e.g. Summer Sale 50% Off" 
                                    value={newSectionData.title} 
                                    onChange={(e) => setNewSectionData({...newSectionData, title: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm font-normal text-gray-800 outline-none focus:bg-white focus:ring-2 ring-blue-100 transition"
                                 />
                             </div>
                             <div className="flex items-end gap-2">
                                 <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-black uppercase hover:bg-blue-700 transition">Create</button>
                                 <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-black uppercase hover:bg-gray-200 transition">Cancel</button>
                             </div>
                         </div>
                     </div>
                 )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">All Sections</h3>
                        {!showCreateForm && (
                            <button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                                <MdAdd size={14} /> NEW SECTION
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Section Heading</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Items</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {homeSections.map((section) => (
                                    <tr key={section.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedSectionId(section.id)}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">{section.title}</span>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{section.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                                {section.products?.length || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedSectionId(section.id); }}
                                                    className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] font-black hover:bg-black transition shadow-sm"
                                                >
                                                    MANAGE
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteSection(section.id, e)}
                                                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <MdDelete size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {homeSections.length === 0 && (
                                    <tr><td colSpan="3" className="px-6 py-12 text-center text-xs text-gray-400 font-bold italic">No sections found. Create one above!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // --- Detail View (Compact Management) ---
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedSectionId(null)} className="p-2 text-gray-400 hover:text-gray-900 transition"><MdArrowBack size={20} /></button>
                    {isEditingTitle ? (
                        <div className="flex items-center gap-2">
                            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="text-sm font-bold text-gray-900 border-b border-blue-500 outline-none w-48" autoFocus />
                            <button onClick={handleSaveTitle} className="text-blue-600"><MdSave size={18} /></button>
                            <button onClick={() => setIsEditingTitle(false)} className="text-gray-400"><MdClose size={18} /></button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">{activeSection.title}</h2>
                            <button onClick={handleEditTitleOpen} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition"><MdEdit size={14} /></button>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setShowProductModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black hover:bg-blue-700 transition"
                >
                    <MdAdd size={16} /> ADD PRODUCTS
                </button>
            </div>

            {/* Product List (Mini Cards) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                {activeSection.products?.length === 0 ? (
                    <div className="py-12 text-center text-xs text-gray-400 font-bold italic">No products in this section yet.</div>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {activeSection.products.map((p) => (
                            <div key={p.id} className="group relative bg-gray-50 border border-gray-100 rounded-xl p-1.5 hover:border-blue-200 transition">
                                <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5">
                                    <img src={p.image} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="text-[9px] font-bold text-gray-700 truncate px-0.5">{p.name}</h4>
                                <button onClick={() => removeProductFromSection(activeSection.id, p._id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-red-500 rounded-lg shadow-sm border border-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <MdDelete size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Compact Product Picker Modal */}
            {showProductModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductModal(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider">Select Products</h3>
                            <button onClick={() => setShowProductModal(false)}><MdClose size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="p-4 bg-gray-50/50">
                            <div className="relative">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search..." className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold outline-none focus:border-blue-400" />
                            </div>
                        </div>
                        <div className="max-h-[350px] overflow-y-auto p-4 space-y-2 no-scrollbar">
                            {filteredProducts.map(p => {
                                const exists = activeSection.products?.some(ap => ap.id === p.id);
                                return (
                                    <button key={p.id} disabled={exists} onClick={() => { addProductToSection(activeSection.id, p); setShowProductModal(false); }} className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${exists ? 'opacity-40 bg-gray-50 border-transparent' : 'bg-white border-gray-100 hover:border-blue-100'}`}>
                                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0"><p className="text-[10px] font-black text-gray-800 truncate">{p.name}</p><p className="text-[9px] text-gray-400 font-bold uppercase">₹{p.price}</p></div>
                                        {!exists && <MdAdd size={18} className="text-blue-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeSections;
