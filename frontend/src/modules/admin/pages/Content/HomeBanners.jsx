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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useBannerStore from '../../store/bannerStore';
import useProductStore from '../../store/productStore';
import { useContentStore } from '../../store/contentStore';
import API from '../../../../services/api';

const HomeBanners = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Correct store usage
    const { banners, addBanner, updateBanner, deleteBanner, fetchBanners } = useBannerStore();
    const { products } = useProductStore();
    const { homeSections, fetchHomeSections } = useContentStore();
    const [offers, setOffers] = useState([]);

    // Fetch data on mount
    useEffect(() => {
        fetchBanners();
        fetchHomeSections();
        // Fetch offers
        API.get('/offers').then(({ data }) => setOffers(data)).catch(console.error);
    }, [fetchBanners, fetchHomeSections]);
    
    // Handle URL-based form opening after banners are loaded
    useEffect(() => {
        const view = searchParams.get('view');
        const bannerId = searchParams.get('id');
        
        if (view === 'edit' && bannerId && banners.length > 0) {
            const banner = banners.find(b => (b.id || b._id) === bannerId);
            if (banner) {
                // Set form data directly
                setFormData({
                    ...banner,
                    slides: banner.slides || [],
                    content: banner.content || {
                        brand: '', brandTag: '', title: '', subtitle: '', description: '',
                        imageUrl: '', badgeText: '', offerText: '', offerBank: '', backgroundColor: ''
                    }
                });
                setHeroImagePreview(banner.content?.imageUrl || '');
            }
        } else if (view === 'new') {
            setFormData({ 
                section: 'HomeHero', type: 'slides', active: true, slides: [],
                content: { brand: '', brandTag: '', title: '', subtitle: '', description: '', imageUrl: '', badgeText: '', offerText: '', offerBank: '', backgroundColor: '' } 
            });
            setHeroImageFile(null);
            setHeroImagePreview('');
        }
    }, [searchParams, banners]);

    // UI State - controlled by URL
    const showForm = searchParams.get('view') === 'edit' || searchParams.get('view') === 'new';
    const selectedBannerId = searchParams.get('id') || 'new';

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
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);
    const heroFileInputRef = useRef(null);

    const handleAddSlide = (e) => {
        const files = Array.from(e.target.files);
        const newSlides = files.map(file => ({
            id: Date.now() + Math.random(),
            imageUrl: 'SLIDE_IMG_INDEX::' + (formData.slides.length),
            originalName: file.name,
            preview: URL.createObjectURL(file),
            file: file,
            linkedProduct: null,
            targetType: 'product', // Default to product
            linkedOffer: null
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
        setIsSaving(true);
        const loadingToast = toast.loading('Saving banner...');
        
        try {
            const data = new FormData();
            data.append('section', formData.section);
            data.append('type', formData.type);
            data.append('active', String(formData.active));

            if (formData.type === 'slides') {
                 // Handle Slides (Same logic as before)
                 const slidesMetadata = formData.slides.map((s, i) => {
                     if (s.file) {
                         return { 
                             ...s, 
                             imageUrl: `SLIDE_IMG_INDEX::${i}`, 
                             targetType: s.targetType || 'product',
                             linkedOffer: s.linkedOffer || null,
                             file: undefined, 
                             preview: undefined 
                         }; 
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
                      data.append('hero_image_url', formData.content.imageUrl);
                 }
            }


            if (selectedBannerId && selectedBannerId !== 'new') {
                await updateBanner(selectedBannerId, data);
            } else {
                await addBanner(data);
            }
            
            await fetchBanners(); // Refresh list
            toast.success('Banner saved successfully!', { id: loadingToast });
            
            // Do NOT close form - user wants to stay
            // But we might want to update URL if it was 'new' to 'edit' state?
            // For now, simple stay is fine. If it was 'new', it remains 'new' in URL but saves new copies?
            // Ideally if 'new', we should switch to edit mode with new ID.
            // But for now, let's just keep form open as requested.
            
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to save banner', { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    const openNewBannerForm = () => {
        setFormData({ 
            section: 'HomeHero', type: 'slides', active: true, slides: [],
            content: { brand: '', brandTag: '', title: '', subtitle: '', description: '', imageUrl: '', badgeText: '', offerText: '', offerBank: '', backgroundColor: '' } 
        }); 
        setHeroImageFile(null);
        setHeroImagePreview('');
        setSearchParams({ view: 'new' });
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
        setSearchParams({ view: 'edit', id: banner.id || banner._id });
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
                        onClick={openNewBannerForm}
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
                    <button onClick={() => setSearchParams({})} className="text-gray-400 hover:text-gray-600"><MdArrowBack size={24} /></button>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">{selectedBannerId === 'new' ? 'New Banner' : 'Edit Banner'}</h2>
                </div>
                <button 
                    onClick={handleSaveBanner} 
                    disabled={isSaving}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
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
                            {!homeSections.some(s => s.id === 'Electronics') && <option key="electronics-legacy" value="Electronics">Electronics (Legacy)</option>}
                            {!homeSections.some(s => s.id === 'Fashion') && <option key="fashion-legacy" value="Fashion">Fashion (Legacy)</option>}
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

                            {/* Click Action for Hero Banners */}
                             <div className="space-y-3 pt-2 border-t border-gray-50">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Click Action</label>
                                <div className="flex gap-2 flex-wrap">
                                    <label className={`flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-bold transition ${formData.content.targetType === 'product' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-transparent text-gray-400'}`}>
                                        <input
                                            type="radio"
                                            checked={!formData.content.targetType || formData.content.targetType === 'product'}
                                            onChange={() => setFormData({...formData, content: {...formData.content, targetType: 'product'}})}
                                            className="hidden"
                                        />
                                        Product
                                    </label>
                                    <label className={`flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-bold transition ${formData.content.targetType === 'offer' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-transparent text-gray-400'}`}>
                                        <input
                                            type="radio"
                                            checked={formData.content.targetType === 'offer'}
                                            onChange={() => setFormData({...formData, content: {...formData.content, targetType: 'offer'}})}
                                            className="hidden"
                                        />
                                        Offer
                                    </label>
                                    <label className={`flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-bold transition ${formData.content.targetType === 'url' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-transparent text-gray-400'}`}>
                                        <input
                                            type="radio"
                                            checked={formData.content.targetType === 'url'}
                                            onChange={() => setFormData({...formData, content: {...formData.content, targetType: 'url'}})}
                                            className="hidden"
                                        />
                                        URL
                                    </label>
                                </div>

                                {/* Conditional Inputs */}
                                {(formData.content.targetType === 'offer') && (
                                    <select
                                        value={formData.content.linkedOffer || ''}
                                        onChange={(e) => {
                                             const selectedOffer = offers.find(o => o._id === e.target.value);
                                             
                                             const newContent = {
                                                 ...formData.content,
                                                 linkedOffer: e.target.value
                                             };
                                             
                                             // Auto-populate logic
                                             if (selectedOffer) {
                                                  // Auto-fill texts if empty
                                                  if (!newContent.title) newContent.title = selectedOffer.title;
                                                  if (!newContent.offerText) newContent.offerText = `${selectedOffer.discountValue}${selectedOffer.discountType === 'percentage' ? '% OFF' : ' OFF'}`;
                                                  
                                                  // Auto-fill image
                                                  if (selectedOffer.bannerImage) {
                                                      newContent.imageUrl = selectedOffer.bannerImage;
                                                      setHeroImagePreview(selectedOffer.bannerImage);
                                                      setHeroImageFile(null); // Clear manual upload
                                                  }
                                             }
                                             
                                             setFormData({...formData, content: newContent});
                                        }}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-sm text-gray-800"
                                    >
                                        <option value="">Select Offer...</option>
                                        {offers.map(offer => (
                                            <option key={offer._id} value={offer._id}>
                                                {offer.title} ({offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} OFF)
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {(!formData.content.targetType || formData.content.targetType === 'product') && (
                                     <input 
                                        type="text" 
                                        placeholder="Product Name or ID" 
                                        value={formData.content.linkedProduct || ''} 
                                        onChange={(e) => setFormData({...formData, content: {...formData.content, linkedProduct: e.target.value}})} 
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-base text-gray-800" 
                                    />
                                )}
                                
                                {(formData.content.targetType === 'url') && (
                                     <input 
                                        type="text" 
                                        placeholder="https://..." 
                                        value={formData.content.link || ''} 
                                        onChange={(e) => setFormData({...formData, content: {...formData.content, link: e.target.value}})} 
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-blue-500 outline-none text-base text-gray-800" 
                                    />
                                )}
                             </div>

                             <div className="pt-4">
                                {(formData.content.linkedOffer && offers.find(o => o._id === formData.content.linkedOffer)?.bannerImage) ? (
                                    <div className="w-full aspect-video rounded-2xl border-2 border-green-500 relative overflow-hidden group">
                                         <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10">
                                            <MdLocalOffer size={12} /> Image from Offer
                                        </div>
                                        <img src={heroImagePreview} className="w-full h-full object-contain p-4 bg-green-50/30" />
                                    </div>
                                ) : (
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
                                )}
                             </div>
                         </div>
                     </div>
                </div>
            )}

            {/* Slideshow Form - Existing Logic Refined */}
            {formData.type === 'slides' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.slides.map((slide, idx) => (
                        <div key={slide.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm relative group space-y-3">
                            <div className="h-36 bg-gray-50 rounded-lg overflow-hidden border border-gray-50">
                                <img src={slide.preview || slide.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <button onClick={() => removeSlide(idx)} className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 transition z-10"><MdDelete size={14} /></button>
                            
                            {/* Click Action Selection */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-gray-400 uppercase">Click Action</label>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSlides = [...formData.slides];
                                            newSlides[idx].targetType = 'product';
                                            setFormData({...formData, slides: newSlides});
                                        }}
                                        className={`flex-1 py-1 px-2 rounded text-[9px] font-bold transition ${slide.targetType === 'product' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-400'}`}
                                    >
                                        Product
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSlides = [...formData.slides];
                                            newSlides[idx].targetType = 'offer';
                                            setFormData({...formData, slides: newSlides});
                                        }}
                                        className={`flex-1 py-1 px-2 rounded text-[9px] font-bold transition ${slide.targetType === 'offer' ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400'}`}
                                    >
                                        Offer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSlides = [...formData.slides];
                                            newSlides[idx].targetType = 'url';
                                            setFormData({...formData, slides: newSlides});
                                        }}
                                        className={`flex-1 py-1 px-2 rounded text-[9px] font-bold transition ${slide.targetType === 'url' ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-400'}`}
                                    >
                                        URL
                                    </button>
                                </div>
                                
                                {/* Conditional Inputs */}
                                {slide.targetType === 'offer' && (
                                    <select
                                        value={slide.linkedOffer || ''}
                                        onChange={(e) => {
                                            const newSlides = [...formData.slides];
                                            newSlides[idx].linkedOffer = e.target.value;
                                            // Auto-load offer image
                                            const selectedOffer = offers.find(o => o._id === e.target.value);
                                            if (selectedOffer?.bannerImage) {
                                                newSlides[idx].imageUrl = selectedOffer.bannerImage;
                                                newSlides[idx].preview = selectedOffer.bannerImage;
                                            }
                                            setFormData({...formData, slides: newSlides});
                                        }}
                                        className="w-full p-1.5 text-[10px] border border-gray-200 rounded bg-white"
                                    >
                                        <option value="">Select Offer...</option>
                                        {offers.map(offer => (
                                            <option key={offer._id} value={offer._id}>
                                                {offer.title} ({offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} OFF)
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {slide.targetType === 'product' && (
                                    <button
                                        type="button"
                                        onClick={() => setShowProductPicker(idx)}
                                        className="w-full p-1.5 text-[10px] bg-gray-50 border border-gray-200 rounded text-left hover:bg-gray-100"
                                    >
                                        {slide.linkedProduct ? slide.linkedProduct.name : 'Select Product...'}
                                    </button>
                                )}
                            </div>
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

