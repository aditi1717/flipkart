import React, { useState, useRef } from 'react';
import {
    MdEdit,
    MdSave,
    MdClose,
    MdAdd,
    MdDelete,
    MdSearch,
    MdViewCarousel,
    MdCloudUpload,
    MdArrowBack,
    MdLink
} from 'react-icons/md';
import { useContentStore } from '../../store/contentStore';
import useProductStore from '../../store/productStore';

const HomeBanners = () => {
    const { homeBanners, addHomeBanner, updateHomeBanner, deleteHomeBanner } = useContentStore();
    const { products } = useProductStore();

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [selectedBannerId, setSelectedBannerId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({ name: '', slides: [] });
    const [showProductPicker, setShowProductPicker] = useState(null); // stores slide index
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef(null);

    const handleAddSlide = (e) => {
        const files = Array.from(e.target.files);
        const newSlides = files.map(file => ({
            id: Date.now() + Math.random(),
            imageUrl: URL.createObjectURL(file),
            linkedProduct: null
        }));
        setFormData(prev => ({ ...prev, slides: [...prev.slides, ...newSlides] }));
    };

    const handleSaveBanner = () => {
        if (!formData.name || formData.slides.length === 0) return;
        if (selectedBannerId && selectedBannerId !== 'new') {
            updateHomeBanner(selectedBannerId, formData);
        } else {
            addHomeBanner(formData);
        }
        setShowForm(false);
    };

    const handleEdit = (banner) => {
        setFormData(banner);
        setSelectedBannerId(banner.id);
        setShowForm(true);
    };

    const handleAttachProduct = (slideIndex, product) => {
        const newSlides = [...formData.slides];
        newSlides[slideIndex].linkedProduct = product;
        setFormData({ ...formData, slides: newSlides });
        setShowProductPicker(null);
    };

    const removeSlide = (index) => {
        setFormData({ ...formData, slides: formData.slides.filter((_, i) => i !== index) });
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Main List View (Grid of Compact Cards) ---
    if (!showForm) {
        return (
            <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-end">
                    <button
                        onClick={() => { setFormData({ name: '', slides: [] }); setShowForm(true); setSelectedBannerId('new'); }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-bold hover:bg-purple-700 transition shadow-sm"
                    >
                        NEW BANNER
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {homeBanners.map((banner) => (
                        <div key={banner.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
                            <div className="h-24 bg-gray-50 border-b border-gray-50 relative overflow-hidden">
                                <img src={banner.slides[0]?.imageUrl} className="w-full h-full object-cover opacity-80" />
                                <div className="absolute top-1 right-1 bg-black/60 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full">{banner.slides.length} SLIDES</div>
                            </div>
                            <div className="p-3">
                                <h3 className="text-[11px] font-black text-gray-800 truncate mb-3 uppercase tracking-tight">{banner.name}</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(banner)} className="flex-1 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[9px] font-bold hover:bg-gray-200 transition">EDIT</button>
                                    <button onClick={() => deleteHomeBanner(banner.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"><MdDelete size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {homeBanners.length === 0 && <div className="col-span-full py-8 text-center text-xs text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-xl">No banners found.</div>}
                </div>
            </div>
        );
    }

    // --- Create / Edit Form (Compact & Clean) ---
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowForm(false)} className="text-gray-400"><MdArrowBack size={18} /></button>
                    <input
                        type="text"
                        placeholder="Banner Title..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="text-xs font-black uppercase text-gray-800 outline-none w-48 border-b-2 border-transparent focus:border-purple-200 px-1"
                    />
                </div>
                <button onClick={handleSaveBanner} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black hover:bg-blue-700 transition shadow-sm">SAVE COLLECTION</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {formData.slides.map((slide, idx) => (
                    <div key={slide.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm relative group">
                        <div className="h-28 bg-gray-50 rounded-lg overflow-hidden border border-gray-50 mb-3">
                            <img src={slide.imageUrl} className="w-full h-full object-cover" />
                        </div>

                        {slide.linkedProduct ? (
                            <div className="flex items-center gap-2 p-2 bg-blue-50/50 border border-blue-100 rounded-lg group/link">
                                <img src={slide.linkedProduct.image} className="w-8 h-8 rounded-md object-cover" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-black text-gray-800 truncate leading-none">{slide.linkedProduct.name}</p>
                                    <p className="text-[8px] text-blue-600 font-bold mt-1 uppercase tracking-tighter">LINKED</p>
                                </div>
                                <button onClick={() => { const ns = [...formData.slides]; ns[idx].linkedProduct = null; setFormData({ ...formData, slides: ns }); }} className="text-gray-400 hover:text-red-500"><MdClose size={14} /></button>
                            </div>
                        ) : (
                            <button onClick={() => setShowProductPicker(idx)} className="w-full py-2.5 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-[9px] font-bold text-gray-400 hover:bg-gray-100 transition uppercase tracking-widest">Attach Product</button>
                        )}

                        <button onClick={() => removeSlide(idx)} className="absolute top-1 right-1 w-6 h-6 bg-white text-red-500 rounded-lg shadow-sm border border-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><MdDelete size={14} /></button>
                    </div>
                ))}

                <button
                    onClick={() => fileInputRef.current.click()}
                    className="h-[188px] border-4 border-dashed border-gray-50 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center hover:border-purple-100 hover:bg-white transition group"
                >
                    <input type="file" ref={fileInputRef} hidden multiple onChange={handleAddSlide} accept="image/*" />
                    <MdAdd size={24} className="text-purple-200 group-hover:scale-110 transition" />
                    <span className="text-[9px] font-black text-gray-300 mt-2 uppercase tracking-widest group-hover:text-purple-300 transition">Add More Slides</span>
                </button>
            </div>

            {/* Compact Product Picker Modal */}
            {showProductPicker !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductPicker(null)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-3 border-b border-gray-50 flex justify-between items-center"><h3 className="text-[9px] font-black uppercase tracking-wider">Select Product</h3><button onClick={() => setShowProductPicker(null)}><MdClose size={18} /></button></div>
                        <div className="p-3"><div className="relative"><MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-[10px] outline-none" /></div></div>
                        <div className="max-h-[300px] overflow-y-auto p-3 space-y-1.5 no-scrollbar">
                            {filteredProducts.map(p => (
                                <button key={p.id} onClick={() => handleAttachProduct(showProductPicker, p)} className="w-full flex items-center gap-3 p-2 rounded-lg border border-gray-50 hover:border-blue-100 hover:bg-blue-50/20 transition text-left group">
                                    <img src={p.image} className="w-8 h-8 rounded-md object-cover" />
                                    <div className="flex-1 min-w-0 font-bold text-[10px] truncate">{p.name}</div>
                                    <MdAdd size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeBanners;
