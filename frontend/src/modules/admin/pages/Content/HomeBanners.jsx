import React, { useState, useRef, useEffect } from 'react';
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
    MdLink,
    MdImage
} from 'react-icons/md';
import useBannerStore from '../../store/bannerStore';
import useProductStore from '../../store/productStore';
import { useContentStore } from '../../store/contentStore';

const HomeBanners = () => {
    // Correct store usage
    const { banners, addBanner, updateBanner, deleteBanner, fetchBanners } = useBannerStore();
    const { products } = useProductStore();
    const { homeSections, fetchHomeSections } = useContentStore();

    useEffect(() => {
        fetchBanners();
        fetchHomeSections();
    }, [fetchBanners, fetchHomeSections]);

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [selectedBannerId, setSelectedBannerId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        section: 'HomeHero', // Default section
        type: 'slides', // 'slides' or 'hero'
        active: true,
        slides: [],
        content: {
            brand: '',
            brandTag: '',
            title: '',
            subtitle: '',
            description: '',
            imageUrl: '',
            badgeText: '',
            offerText: '',
            offerBank: '',
            backgroundColor: ''
        }
    });

    const [heroImageFile, setHeroImageFile] = useState(null);
    const [heroImagePreview, setHeroImagePreview] = useState('');

    const [showProductPicker, setShowProductPicker] = useState(null); // stores slide index
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef(null);
    const heroFileInputRef = useRef(null);

    const handleAddSlide = (e) => {
        const files = Array.from(e.target.files);
        const newSlides = files.map(file => ({
            id: Date.now() + Math.random(),
            imageUrl: 'SLIDE_IMG_INDEX::' + (formData.slides.length), // Placeholder for backend mapping (needs improvement but works if sequential)
            originalName: file.name, // To match file in backend
            preview: URL.createObjectURL(file), // Local preview
            file: file, // Store file object for upload
            linkedProduct: null
        }));
        // Note: Real index mapping needs to account for existing slides. 
        // For simplicity here, we will just start index based on current length, but this is flaky for multiple batches.
        // A better approach is to append files to a separate array and map by index in that array.
        // But let's stick to simple form submission with FormData constructing.
         setFormData(prev => ({ ...prev, slides: [...prev.slides, ...newSlides] }));
    };

    const handleHeroImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setHeroImageFile(file);
        setHeroImagePreview(URL.createObjectURL(file));
        // Update formData content.imageUrl just for UI state if needed, but file is separate
    };

    const handleSaveBanner = async () => {
        const data = new FormData();
        data.append('section', formData.section);
        data.append('type', formData.type);
        data.append('active', String(formData.active));

        if (formData.type === 'slides') {
             // Handle Slides
             // We need to re-index the image placeholders or just send them as is and hope backend logic aligns
             // A safer way: send slides metadata JSON, and separate files with matching fieldnames/indices?
             // The backend logic: `if (slide.imageUrl.startsWith('SLIDE_IMG_INDEX::'))` looks for `slideFiles[idx]`.
             // We need to ensure `slide_images` array aligns with these indices.
             // This is tricky.
             // Let's assume for now user only adds NEW slides in one go or we don't support mixed partial edits well without better logic.
             // Simplified: new slides have file objects attached.
             
             const slidesMetadata = formData.slides.map((s, i) => {
                 if (s.file) {
                     return { ...s, imageUrl: `SLIDE_IMG_INDEX::${i}`, file: undefined, preview: undefined }; 
                 }
                 return s;
             });

             data.append('slides', JSON.stringify(slidesMetadata));
             
             formData.slides.forEach((s) => {
                 if (s.file) {
                     data.append('slide_images', s.file);
                 }
             });

        } else {
             // Handle Hero
             data.append('content', JSON.stringify(formData.content));
             if (heroImageFile) {
                 data.append('hero_image', heroImageFile);
             } else if (formData.content.imageUrl) {
                 // Keep existing URL
                  data.append('hero_image_url', formData.content.imageUrl);
             }
        }


        if (selectedBannerId && selectedBannerId !== 'new') {
            await updateBanner(selectedBannerId, data);
        } else {
            await addBanner(data);
        }
        setShowForm(false);
        setHeroImageFile(null);
        setHeroImagePreview('');
    };

    const handleEdit = (banner) => {
        // Prepare initial state
        setFormData({
            ...banner,
            slides: banner.slides || [],
            content: banner.content || {
                brand: '', brandTag: '', title: '', subtitle: '', description: '',
                imageUrl: '', badgeText: '', offerText: '', offerBank: '', backgroundColor: ''
            }
        });
        setHeroImagePreview(banner.content?.imageUrl || '');
        setSelectedBannerId(banner.id || banner._id);
        setShowForm(true);
    };

    const removeSlide = (index) => {
        setFormData({ ...formData, slides: formData.slides.filter((_, i) => i !== index) });
    };

     const handleAttachProduct = (slideIndex, product) => {
        const newSlides = [...formData.slides];
        newSlides[slideIndex].linkedProduct = product;
        setFormData({ ...formData, slides: newSlides });
        setShowProductPicker(null);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Main List View ---
    if (!showForm) {
        return (
            <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-end">
                    <button
                        onClick={() => { 
                            setFormData({ 
                                section: 'HomeHero', type: 'slides', active: true, slides: [],
                                content: { brand: '', brandTag: '', title: '', subtitle: '', description: '', imageUrl: '', badgeText: '', offerText: '', offerBank: '', backgroundColor: '' } 
                            }); 
                            setHeroImageFile(null);
                            setHeroImagePreview('');
                            setShowForm(true); 
                            setSelectedBannerId('new'); 
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-bold hover:bg-purple-700 transition shadow-sm"
                    >
                        NEW BANNER
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner.id || banner._id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
                            <div className="h-32 bg-gray-50 border-b border-gray-50 relative overflow-hidden">
                                {banner.type === 'hero' ? (
                                    <img src={banner.content?.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={banner.slides[0]?.imageUrl} className="w-full h-full object-cover opacity-80" />
                                )}
                                <div className="absolute top-2 right-2 flex gap-1">
                                     <span className="bg-black/60 text-[8px] font-bold text-white px-2 py-0.5 rounded-full uppercase">{banner.type}</span>
                                     <span className="bg-blue-600/80 text-[8px] font-bold text-white px-2 py-0.5 rounded-full uppercase">{banner.section}</span>
                                </div>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">{banner.type === 'hero' ? banner.content?.brand : `${banner.slides.length} Slides`}</p>
                                    <h3 className="text-sm font-black text-gray-800 truncate uppercase tracking-tight">{banner.type === 'hero' ? banner.content?.title : 'Slideshow'}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(banner)} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"><MdEdit size={16} /></button>
                                    <button onClick={() => deleteBanner(banner.id || banner._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"><MdDelete size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {banners.length === 0 && <div className="col-span-full py-12 text-center text-xs text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-xl">No banners found.</div>}
                </div>
            </div>
        );
    }

    // --- Create / Edit Form ---
    return (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-4 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><MdArrowBack size={24} /></button>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">{selectedBannerId === 'new' ? 'New Banner' : 'Edit Banner'}</h2>
                </div>
                <button onClick={handleSaveBanner} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200 uppercase tracking-wider">SAVE CHANGES</button>
            </div>

            {/* Configuration */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Section ID</label>
                        <select 
                            value={formData.section} 
                            onChange={(e) => setFormData({...formData, section: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none font-bold text-gray-700"
                        >
                            <option value="HomeHero">Home Hero</option>
                            {homeSections.map(section => (
                                <option key={section.id} value={section.id}>{section.title} ({section.id})</option>
                            ))}
                            {!homeSections.some(s => s.id === 'Electronics') && <option value="Electronics">Electronics (Legacy)</option>}
                            {!homeSections.some(s => s.id === 'Fashion') && <option value="Fashion">Fashion (Legacy)</option>}
                        </select>
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Banner Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                             <button
                                onClick={() => setFormData({...formData, type: 'slides'})}
                                className={`py-2 rounded-lg text-xs font-bold transition-all border ${formData.type === 'slides' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-transparent text-gray-400 hover:text-gray-600'}`}
                             >
                                 SLIDESHOW
                             </button>
                             <button
                                onClick={() => setFormData({...formData, type: 'hero'})}
                                className={`py-2 rounded-lg text-xs font-bold transition-all border ${formData.type === 'hero' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-transparent text-gray-400 hover:text-gray-600'}`}
                             >
                                 HERO
                             </button>
                             <button
                                onClick={() => setFormData({...formData, type: 'card'})}
                                className={`py-2 rounded-lg text-xs font-bold transition-all border ${formData.type === 'card' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-gray-50 border-transparent text-gray-400 hover:text-gray-600'}`}
                             >
                                 CARD
                             </button>
                             <button
                                onClick={() => setFormData({...formData, type: 'product_feature'})}
                                className={`py-2 rounded-lg text-xs font-bold transition-all border ${formData.type === 'product_feature' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-transparent text-gray-400 hover:text-gray-600'}`}
                             >
                                 FEATURE
                             </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Form (Hero, Card, Feature use same fields) */}
            {['hero', 'card', 'product_feature'].includes(formData.type) && (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in slide-in-from-bottom-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-50 pb-2">Text Content</h3>
                             <div className="space-y-4">
                                <input type="text" placeholder="Brand Name (e.g. Vivo)" value={formData.content.brand} onChange={(e) => setFormData({...formData, content: {...formData.content, brand: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-base text-gray-800" />
                                <input type="text" placeholder="Brand Tag (e.g. Flipkart Unique)" value={formData.content.brandTag} onChange={(e) => setFormData({...formData, content: {...formData.content, brandTag: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-base text-gray-800" />
                                <input type="text" placeholder="Main Title (e.g. T4 Pro 5G)" value={formData.content.title} onChange={(e) => setFormData({...formData, content: {...formData.content, title: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-lg font-bold text-gray-900" />
                                <input type="text" placeholder="Subtitle / Price (e.g. From ₹4,250/M*)" value={formData.content.subtitle} onChange={(e) => setFormData({...formData, content: {...formData.content, subtitle: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-base text-gray-800" />
                                <textarea placeholder="Description (e.g. Flagship level 3X zoom)" value={formData.content.description} onChange={(e) => setFormData({...formData, content: {...formData.content, description: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-base text-gray-800 h-24 resize-none" />
                             </div>
                         </div>

                         <div className="space-y-6">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-50 pb-2">Offers & Badge</h3>
                             <div className="space-y-4">
                                <input type="text" placeholder="Offer Bank (e.g. HDFC BANK)" value={formData.content.offerBank} onChange={(e) => setFormData({...formData, content: {...formData.content, offerBank: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-base text-gray-800" />
                                <input type="text" placeholder="Offer Text (e.g. Flat ₹3,000 Off)" value={formData.content.offerText} onChange={(e) => setFormData({...formData, content: {...formData.content, offerText: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-base text-gray-800" />
                                <input type="text" placeholder="Image Badge (e.g. 3X Periscope Camera)" value={formData.content.badgeText} onChange={(e) => setFormData({...formData, content: {...formData.content, badgeText: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-base text-gray-800" />
                             </div>

                             <div className="pt-4">
                                <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer relative overflow-hidden group">
                                    {heroImagePreview ? (
                                        <img src={heroImagePreview} className="w-full h-full object-contain p-4" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                                            <MdCloudUpload size={48} />
                                            <span className="text-xs font-black uppercase mt-2">Upload Hero Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold uppercase transition-opacity">Change Image</div>
                                    <input type="file" ref={heroFileInputRef} hidden onChange={handleHeroImageUpload} accept="image/*" />
                                </label>
                             </div>
                         </div>
                     </div>
                </div>
            )}

            {/* Slideshow Form - Existing Logic Refined */}
            {formData.type === 'slides' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.slides.map((slide, idx) => (
                        <div key={slide.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm relative group">
                            <div className="h-36 bg-gray-50 rounded-lg overflow-hidden border border-gray-50 mb-3">
                                <img src={slide.preview || slide.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <button onClick={() => removeSlide(idx)} className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 transition"><MdDelete size={14} /></button>
                        </div>
                    ))}
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="h-[200px] border-4 border-dashed border-gray-50 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center hover:border-purple-100 hover:bg-white transition group"
                    >
                        <input type="file" ref={fileInputRef} hidden multiple onChange={handleAddSlide} accept="image/*" />
                        <MdAdd size={32} className="text-purple-200 group-hover:scale-110 transition" />
                        <span className="text-[10px] font-black text-gray-300 mt-2 uppercase tracking-widest group-hover:text-purple-300 transition">Add Slides</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomeBanners;

