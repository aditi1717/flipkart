import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mockData';
import { useCartStore } from '../store/cartStore';
import ProductSection from '../components/home/ProductSection';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, wishlist, toggleWishlist } = useCartStore();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [highRatedProducts, setHighRatedProducts] = useState([]);
    const [showToast, setShowToast] = useState(false);

    const isInWishlist = product && wishlist.find(item => item.id === product.id);

    const handleAddToCart = () => {
        addToCart(product, { selectedSize, selectedColor });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleBuyNow = () => {
        addToCart(product, { selectedSize, selectedColor });
        navigate('/checkout');
    };
    const [reviews, setReviews] = useState([
        { id: 1, user: 'Aditi Sharma', rating: 5, comment: 'Perfect match for my party wear! The quality is amazing.', date: '2 days ago' },
        { id: 2, user: 'Rahul V.', rating: 4, comment: 'Very beautiful design, though slightly larger than expected.', date: '1 week ago' }
    ]);
    const [questions, setQuestions] = useState([
        { id: 1, q: 'Is this skin friendly?', a: 'Yes, it is anti-allergic and safe for all skin types.', user: 'Sonal M.' }
    ]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [newQuestion, setNewQuestion] = useState('');

    const [expandedSections, setExpandedSections] = useState({
        highlights: false,
        allDetails: false,
        reviews: false,
        questions: false
    });
    const [selectedDetailTab, setSelectedDetailTab] = useState('Description');
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState('Black');
    const [selectedSize, setSelectedSize] = useState('M');

    const colors = [
        { name: 'Black', img: 'https://rukminim2.flixcart.com/image/832/832/xif0q/gown/v/h/t/na-s-short-gown-z-atkins-original-imagp8m8zgzgzgze.jpeg' },
        { name: 'Green', img: 'https://rukminim2.flixcart.com/image/832/832/xif0q/gown/i/a/e/na-s-short-gown-z-atkins-original-imagp8m8vfsxhv6f.jpeg' },
        { name: 'Purple', img: 'https://rukminim2.flixcart.com/image/832/832/xif0q/gown/m/3/g/na-s-short-gown-z-atkins-original-imagp8m8yghyyzgz.jpeg' },
        { name: 'Wine', img: 'https://rukminim2.flixcart.com/image/832/832/xif0q/gown/y/f/v/na-s-short-gown-z-atkins-original-imagp8m8xghfgyvz.jpeg' }
    ];

    const sizes = [
        { label: 'XS', available: false },
        { label: 'S', available: false },
        { label: 'M', available: true },
        { label: 'L', available: false },
        { label: 'XL', available: false },
        { label: 'XXL', available: true }
    ];

    const productImages = product ? [
        product.image,
        'https://rukminim2.flixcart.com/image/832/832/xif0q/earring/y/t/z/na-er-2023-455-p4-shining-diva-fashion-original-imagrvv4hfyhywhm.jpeg',
        'https://rukminim2.flixcart.com/image/832/832/xif0q/earring/e/n/z/na-er-2023-455-p4-shining-diva-fashion-original-imagrvv4gy8nzmqy.jpeg'
    ] : [];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const pid = parseInt(id);
        const found = products.find(p => p.id === pid);
        if (found) {
            setProduct(found);
            // Find similar products
            const similar = products.filter(p => p.category === found.category && p.id !== pid);
            setSimilarProducts(similar);
            // Find high rated products in Fashion/Jewelry
            const highRated = products.filter(p => p.rating >= 4.0 && p.id !== pid).slice(0, 6);
            setHighRatedProducts(highRated);
        }
    }, [id]);

    if (!product) return <div className="p-10 text-center">Loading...</div>;

    const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
            {/* Floating Back Button - Transparent and Sticky */}
            <div className="sticky top-4 z-[100] h-0 overflow-visible pointer-events-none px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto w-10 h-10 flex items-center justify-center text-gray-800 active:scale-95 transition-transform"
                    style={{ textShadow: '0 0 10px rgba(255,255,255,0.8)' }}
                >
                    <span className="material-icons text-[28px]">arrow_back</span>
                </button>
            </div>

            {/* Product Image Section - Swipable Gallery - No top gap */}
            <div className="relative w-full aspect-[3/2] bg-[#f9f9f9] border-b border-gray-100 group">
                <div
                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full w-full"
                    onScroll={(e) => {
                        const width = e.target.offsetWidth;
                        const index = Math.round(e.target.scrollLeft / width);
                        setCurrentImageIndex(index);
                    }}
                >
                    {productImages.map((img, idx) => (
                        <div key={idx} className="min-w-full h-full snap-center flex items-center justify-center px-4 pb-4 pt-1">
                            <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>

                {/* Icons - Top Right */}
                <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                    <button
                        onClick={() => toggleWishlist(product)}
                        className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center border border-white/50"
                    >
                        <span className={`material-icons text-xl ${isInWishlist ? 'text-red-500' : 'text-gray-700'}`}>
                            {isInWishlist ? 'favorite' : 'favorite_border'}
                        </span>
                    </button>
                    <button className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center border border-white/50">
                        <span className="material-icons-outlined text-gray-700 text-xl">share</span>
                    </button>
                </div>

                {/* Pagination Dots - Bottom Center */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {productImages.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'w-6 bg-gray-800' : 'w-1.5 bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Product Info - More compact */}
            <div className="px-4 py-3 space-y-1">
                {/* Brand */}
                {product.brand && (
                    <h2 className="text-gray-900 text-sm font-bold uppercase tracking-wide">
                        {product.brand}
                    </h2>
                )}
                {!product.brand && <h2 className="text-gray-900 text-sm font-bold uppercase tracking-wide">Brand Name</h2>}

                {/* Name & More Content */}
                <div className="text-gray-600 text-sm font-normal leading-relaxed">
                    <p className={`${showFullDescription ? '' : 'line-clamp-2'}`}>
                        {product.name}
                        {product.description && <span className="block mt-1">{product.description}</span>}
                        {!product.description && <span className="block mt-1">This premium product is crafted with high-quality materials to ensure durability and style. Perfect for daily wear or special occasions, it adds a touch of elegance to any outfit.</span>}
                    </p>
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-blue-600 font-bold text-xs mt-1 hover:underline flex items-center"
                    >
                        {showFullDescription ? 'Show less' : '...more'}
                        <span className="material-icons text-[14px] ml-0.5">
                            {showFullDescription ? 'expand_less' : 'expand_more'}
                        </span>
                    </button>
                </div>

                {/* Price */}
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-[22px] font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice > product.price && (
                        <>
                            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <span className="text-sm text-green-700 font-bold">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Selected Color Section */}
            <div className="px-4 mt-6">
                <p className="text-[14px] font-bold text-gray-900 mb-3 uppercase tracking-tight">
                    Selected Color: <span className="font-normal text-gray-600 normal-case">{selectedColor}</span>
                </p>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {colors.map((color) => (
                        <div
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={`min-w-[70px] aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedColor === color.name ? 'border-black shadow-sm' : 'border-gray-100'
                                }`}
                        >
                            <img src={color.img} alt={color.name} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Select Size Section */}
            <div className="px-4 mt-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-gray-900 uppercase tracking-tight">Select Size</span>
                        <button className="text-[13px] font-bold text-blue-600">Size Chart</button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size.label}
                            onClick={() => size.available && setSelectedSize(size.label)}
                            className={`min-w-[48px] h-[36px] px-2 rounded-lg flex items-center justify-center text-[12px] font-bold border transition-all ${!size.available
                                ? 'border-dashed border-gray-200 text-gray-300 cursor-not-allowed opacity-60'
                                : selectedSize === size.label
                                    ? 'border-black bg-white text-gray-900 shadow-sm'
                                    : 'border-gray-200 text-gray-900'
                                }`}
                        >
                            {size.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Offers Section */}
            <div className="px-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[15px] font-bold text-gray-900">Offers for you</h3>
                    <span className="text-blue-600 text-[12px] font-bold">View all</span>
                </div>
                <div className="bg-[#f0f7ff] border border-blue-50/50 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                        <span className="material-icons text-blue-600 text-[18px] mt-0.5">local_offer</span>
                        <div>
                            <p className="text-[12px] font-bold text-gray-900">10% instant discount on Bank of Baroda</p>
                            <p className="text-[10px] text-gray-500 font-medium leading-tight">Use code: BOB10 | Min. purchase ₹2500</p>
                        </div>
                    </div>
                    <button className="bg-white border border-blue-600/20 text-blue-600 px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap shadow-sm">
                        Apply Now
                    </button>
                </div>
            </div>

            {/* Delivery Details Section - More compact */}
            <div className="px-4 mt-6">
                <h3 className="text-[15px] font-bold text-gray-900 mb-4">Delivery details</h3>

                <div className="rounded-2xl overflow-hidden border border-gray-50 shadow-sm">
                    {/* Location Bar */}
                    <div className="bg-[#f0f7ff] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="material-icons-outlined text-gray-800 text-[20px]">location_on</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[14px] font-bold text-gray-900">{product.pincode || '364515'}</span>
                                <button className="text-[14px] font-bold text-blue-600 flex items-center">
                                    Select delivery location
                                    <span className="material-icons text-[14px] ml-0.5">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Date */}
                    <div className="bg-[#f5f5f5] p-4 border-t border-white flex items-center gap-3">
                        <span className="material-icons-outlined text-gray-500 text-[20px]">local_shipping</span>
                        <span className="text-[14px] font-bold text-gray-800">Delivery by {product.deliveryDate || '30 Jan, Fri'}</span>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-[#f5f5f5] p-4 border-t border-white flex items-start gap-3">
                        <span className="material-icons-outlined text-gray-500 text-[20px] mt-0.5">storefront</span>
                        <div className="flex-1">
                            <p className="text-[14px] font-bold text-gray-800 mb-0.5">Fulfilled by {product.sellerName || 'RetailNet'}</p>
                            <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                                <span className="text-[12px] flex items-center gap-0.5">
                                    {product.rating || '4.3'} <span className="material-icons text-[12px]">star</span>
                                </span>
                                <span className="text-[10px]">•</span>
                                <span className="text-[12px]">{product.sellerYears || '9 years with Flipkart'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Icons - More compact */}
                <div className="flex justify-between mt-6 mb-4 border-t border-gray-100 pt-4">
                    <div className="flex flex-col items-center gap-2.5 w-1/3 group">
                        <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800">
                            <span className="material-icons-outlined text-[24px]">autorenew</span>
                        </div>
                        <div className="flex items-center text-gray-800">
                            <span className="text-[11px] font-bold text-center leading-tight">10-Day<br />Return</span>
                            <span className="material-icons text-[14px] text-gray-400 ml-0.5">chevron_right</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2.5 w-1/3">
                        <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800">
                            <span className="material-icons-outlined text-[24px]">payments</span>
                        </div>
                        <div className="flex items-center text-gray-800">
                            <span className="text-[11px] font-bold text-center leading-tight">Cash on<br />Delivery</span>
                            <span className="material-icons text-[14px] text-gray-400 ml-0.5">chevron_right</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2.5 w-1/3">
                        <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800">
                            <span className="material-icons-outlined text-[24px]">shield</span>
                        </div>
                        <div className="flex items-center text-gray-800">
                            <span className="text-[11px] font-bold text-center leading-tight">Flipkart<br />Assured</span>
                            <span className="material-icons text-[14px] text-gray-400 ml-0.5">chevron_right</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products Section - Added as requested */}
            <ProductSection
                title="Similar Products"
                products={similarProducts}
                containerClass="mt-4 pb-4"
                onViewAll={() => console.log('View all similar products')}
            />

            {/* Product Highlights Section */}
            <div className="border-t border-gray-100 mt-2">
                <div
                    className="px-4 py-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('highlights')}
                >
                    <div>
                        <h3 className="text-[17px] font-bold text-gray-900 leading-tight">Product highlights</h3>
                        <p className="text-[13px] text-gray-400 mt-0.5">Key features and specifications</p>
                    </div>
                    <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center transition-transform duration-300 ${expandedSections.highlights ? 'rotate-180' : ''}`}>
                        <span className="material-icons text-gray-600 text-[20px]">expand_more</span>
                    </div>
                </div>

                {expandedSections.highlights && (
                    <div className="px-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <div>
                                <p className="text-[13px] text-gray-400 mb-0.5 font-medium">Base Material</p>
                                <p className="text-[15px] text-gray-800 font-bold">Alloy</p>
                            </div>
                            <div>
                                <p className="text-[13px] text-gray-400 mb-0.5 font-medium">Plating</p>
                                <p className="text-[15px] text-gray-800 font-bold">Gold-plated</p>
                            </div>
                            <div>
                                <p className="text-[13px] text-gray-400 mb-0.5 font-medium">Color</p>
                                <p className="text-[15px] text-gray-800 font-bold">White</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* All Details Section - Tabbed Interface with Main Dropdown */}
            <div className="border-t border-gray-100 mt-2">
                <div
                    className="px-4 py-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('allDetails')}
                >
                    <div>
                        <h3 className="text-[17px] font-bold text-gray-900 leading-tight">All details</h3>
                        <p className="text-[13px] text-gray-400 mt-0.5">Tabs for features, specs and more</p>
                    </div>
                    <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center transition-transform duration-300 ${expandedSections.allDetails ? 'rotate-180' : ''}`}>
                        <span className="material-icons text-gray-600 text-[20px]">expand_more</span>
                    </div>
                </div>

                {expandedSections.allDetails && (
                    <div className="pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Tab Headers */}
                        <div className="px-4 mb-4">
                            <div className="flex overflow-x-auto gap-2.5 no-scrollbar -mx-4 px-4 pb-2">
                                {[
                                    { id: 'Features', label: 'Features', icon: 'star_outline' },
                                    { id: 'Specifications', label: 'Specifications', icon: 'list_alt' },
                                    { id: 'Description', label: 'Description', icon: 'description' },
                                    { id: 'Manufacturer', label: 'Manufacturer', icon: 'business' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDetailTab(tab.id);
                                        }}
                                        className={`px-5 py-2.5 rounded-full text-[14px] font-bold whitespace-nowrap transition-all border ${selectedDetailTab === tab.id
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                            : 'bg-white text-gray-600 border-gray-200'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="px-4 animate-in fade-in zoom-in-95 duration-200">
                            <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-sm ring-1 ring-blue-50/50 min-h-[120px]">
                                <div className="text-[14px] text-gray-600 leading-relaxed">
                                    {selectedDetailTab === 'Features' && (
                                        <ul className="space-y-3">
                                            {['Premium quality base material', 'Skin friendly and anti-allergic', 'Handcrafted by expert artisans', 'Perfect for weddings and parties'].map((f, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-blue-400 mt-1">•</span>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {selectedDetailTab === 'Specifications' && (
                                        <div className="space-y-3">
                                            {[
                                                { k: 'Sales Package', v: '1 Pair of Earrings' },
                                                { k: 'Material', v: 'Silver Alloy' },
                                                { k: 'Gemstone', v: 'Artificial Stones' }
                                            ].map((s, i) => (
                                                <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                                                    <span className="text-gray-400 font-medium">{s.k}</span>
                                                    <span className="text-gray-800 font-bold text-right ml-4">{s.v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedDetailTab === 'Description' && (
                                        <p className="italic">
                                            This exquisite piece of jewelry is designed to reflect the elegance of traditional Indian heritage. Crafted with precision, it features intricate details that make it stand out. Whether it's a festive occasion or a formal event, these earrings provide a touch of grace and sophistication to your ensemble.
                                        </p>
                                    )}
                                    {selectedDetailTab === 'Manufacturer' && (
                                        <div className="space-y-1">
                                            <p className="font-bold text-gray-800">RetailNet Exports Pvt Ltd</p>
                                            <p>Plot No 42, GIDC Industrial Estate,</p>
                                            <p>Ahmedabad, Gujarat - 380015</p>
                                            <p className="text-blue-600 font-medium mt-2">contact@retailnetinc.com</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Similar Oversized Studs Section */}
            <div className="border-t border-gray-100 mt-4">
                <ProductSection
                    title={`Similar ${product.brand || ''} Styles`}
                    products={similarProducts.slice(0, 6)}
                    containerClass="mt-2 pb-4"
                    onViewAll={() => console.log('View all similar styles')}
                />
            </div>

            {/* Top Rated Section */}
            <div className="border-t border-gray-100">
                <ProductSection
                    title="Earrings rated 4 stars and above"
                    products={highRatedProducts}
                    containerClass="mt-2 pb-8"
                    onViewAll={() => console.log('View all top rated')}
                />
            </div>

            {/* Ratings and Reviews Section */}
            <div className="border-t border-gray-100 mt-2">
                <div
                    className="px-4 py-5 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('reviews')}
                >
                    <div>
                        <h3 className="text-[17px] font-bold text-gray-900 leading-tight">Ratings and reviews</h3>
                        <p className="text-[13px] text-gray-400 mt-0.5">
                            {reviews.length > 0 ? `${reviews.length} ratings and reviews` : 'No ratings for this product yet'}
                        </p>
                    </div>
                    <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center transition-transform duration-300 ${expandedSections.reviews ? 'rotate-180' : ''}`}>
                        <span className="material-icons text-gray-600 text-[20px]">expand_more</span>
                    </div>
                </div>

                {expandedSections.reviews && (
                    <div className="pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Horizontal Reviews Slide - Narrower cards */}
                        <div className="flex overflow-x-auto gap-3 no-scrollbar px-4 mb-6">
                            {reviews.map(rev => (
                                <div key={rev.id} className="min-w-[220px] w-[220px] bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-shrink-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                            {rev.rating} <span className="material-icons text-[9px]">star</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-800 line-clamp-1">{rev.user}</span>
                                    </div>
                                    <p className="text-[13px] text-gray-600 mb-2 line-clamp-3 leading-relaxed">{rev.comment}</p>
                                    <span className="text-[10px] text-gray-400 font-medium">{rev.date}</span>
                                </div>
                            ))}
                        </div>

                        {/* Post Review Form - Smaller Stars */}
                        <div className="mx-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-100 shadow-sm">
                            <h4 className="text-[14px] font-bold text-gray-800 mb-4">Rate this product</h4>
                            <div className="flex gap-2 mb-5">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${newReview.rating >= star
                                            ? 'bg-[#388e3c] text-white'
                                            : 'bg-white text-gray-300 border border-gray-100'
                                            }`}
                                    >
                                        <span className="material-icons text-[20px]">star</span>
                                    </button>
                                ))}
                            </div>
                            <textarea
                                placeholder="What did you like or dislike?"
                                value={newReview.comment}
                                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-[13px] focus:ring-2 focus:ring-green-100 outline-none resize-none min-h-[90px] mb-4 shadow-inner"
                            />
                            <button
                                onClick={() => {
                                    if (!newReview.comment) return;
                                    setReviews([{ id: Date.now(), user: 'You', rating: newReview.rating, comment: newReview.comment, date: 'Just now' }, ...reviews]);
                                    setNewReview({ rating: 5, comment: '' });
                                }}
                                className="w-full bg-[#1084ea] text-white font-bold py-3 rounded-2xl text-[13px] active:scale-95 transition-all shadow-md"
                            >
                                Post Review
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Questions and Answers Section - Input Only */}
            <div className="border-t border-gray-100 pb-2">
                <div
                    className="px-4 py-5 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('questions')}
                >
                    <h3 className="text-[17px] font-bold text-gray-900 leading-tight">Questions and Answers</h3>
                    <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center transition-transform duration-300 ${expandedSections.questions ? 'rotate-180' : ''}`}>
                        <span className="material-icons text-gray-600 text-[20px]">expand_more</span>
                    </div>
                </div>

                {expandedSections.questions && (
                    <div className="px-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-blue-50/40 rounded-3xl p-5 border border-blue-50 shadow-sm">
                            <h4 className="text-[15px] font-bold text-blue-900 mb-4">Post a question</h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. Is it waterproof?"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    className="flex-1 bg-white border border-blue-100 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 shadow-inner"
                                />
                                <button
                                    onClick={() => {
                                        if (!newQuestion) return;
                                        setNewQuestion('');
                                    }}
                                    className="bg-[#1084ea] text-white w-12 h-12 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg"
                                >
                                    <span className="material-icons text-[24px]">send</span>
                                </button>
                            </div>
                            <p className="text-[12px] text-blue-600 mt-3 font-medium">Get answer from experts and other customers.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Recently Viewed Section */}
            <div className="border-t border-gray-100 mt-2">
                <ProductSection
                    title="Recently Viewed"
                    products={products.slice(0, 6)}
                    containerClass="mt-2 pb-4"
                    onViewAll={() => console.log('View all recently viewed')}
                />
            </div>

            {/* You may also like Section - Tighter padding */}
            <div className="border-t border-gray-100">
                <ProductSection
                    title="You may also like"
                    titleBadge="AD"
                    products={products.slice(6, 12)}
                    containerClass="mt-2 pb-4"
                    onViewAll={() => console.log('View all recommendations')}
                />
            </div>

            {/* Bottom Actions - Fixed Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 flex gap-2 z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white border border-gray-300 text-gray-900 font-bold py-3.5 rounded-xl text-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                    Add to cart
                </button>
                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#ffc200] text-black font-bold py-3.5 rounded-xl text-sm shadow-sm hover:bg-[#ffb300] active:scale-[0.98] transition-all"
                >
                    Buy now
                </button>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-24 left-4 right-4 bg-gray-900 text-white p-4 rounded-xl flex items-center justify-between z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <span className="material-icons text-green-400">check_circle</span>
                        <span className="text-sm font-medium">Added to cart successfully</span>
                    </div>
                    <button
                        onClick={() => navigate('/cart')}
                        className="text-blue-400 font-bold text-sm uppercase"
                    >
                        Go to Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
