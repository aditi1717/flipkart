import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import ProductSection from '../components/home/ProductSection';
import { useProduct, useProducts } from '../../../hooks/useData';
import API from '../../../services/api';
import toast from 'react-hot-toast';

const ProductSkeleton = () => {
    return (
        <div className="bg-white min-h-screen pb-24 font-sans animate-pulse px-4 md:px-0">
            {/* Desktop Skeleton */}
            <div className="hidden md:block max-w-[1600px] mx-auto p-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-3 w-12 bg-gray-100 rounded"></div>
                    <div className="h-3 w-4 bg-gray-50 rounded"></div>
                    <div className="h-3 w-20 bg-gray-100 rounded"></div>
                    <div className="h-3 w-4 bg-gray-50 rounded"></div>
                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                </div>
                <div className="flex gap-10">
                    <div className="w-[40%] flex gap-4">
                        <div className="flex flex-col gap-3 w-16">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg"></div>)}
                        </div>
                        <div className="flex-1 h-[450px] bg-gray-100 rounded-xl"></div>
                    </div>
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <div className="h-3 w-24 bg-gray-100 rounded"></div>
                            <div className="h-8 w-3/4 bg-gray-100 rounded"></div>
                            <div className="h-4 w-full bg-gray-50 rounded"></div>
                            <div className="h-4 w-5/6 bg-gray-50 rounded"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-16 bg-gray-100 rounded"></div>
                            <div className="h-4 w-32 bg-gray-50 rounded"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-gray-100 rounded"></div>
                            <div className="h-10 w-40 bg-gray-100 rounded"></div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <div className="h-14 flex-1 bg-gray-100 rounded-sm"></div>
                            <div className="h-14 flex-1 bg-gray-100 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Skeleton */}
            <div className="md:hidden">
                <div className="w-full aspect-[3/2] bg-gray-100"></div>
                <div className="px-4 py-6 space-y-6">
                    <div className="space-y-2">
                        <div className="h-4 w-1/4 bg-gray-100 rounded"></div>
                        <div className="h-6 w-full bg-gray-100 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-50 rounded"></div>
                    </div>
                    <div className="h-10 w-1/3 bg-gray-100 rounded"></div>
                    <div className="space-y-3">
                        <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                        <div className="flex gap-3">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-16 h-20 bg-gray-100 rounded-xl"></div>)}
                        </div>
                    </div>
                </div>
                {/* Sticky Footer Skeleton */}
                <div className="fixed bottom-0 left-0 right-0 bg-white p-2 flex gap-2 border-t border-gray-100">
                    <div className="h-12 flex-1 bg-gray-100 rounded-sm"></div>
                    <div className="h-12 flex-1 bg-gray-100 rounded-sm"></div>
                </div>
            </div>
        </div>
    );
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, wishlist, toggleWishlist } = useCartStore();
    
    // Fetch individual product
    const { product, loading } = useProduct(id);
    
    // Fetch all products for "Similar" and "High Rated" logic (could be optimized on backend)
    const { products, loading: productsLoading } = useProducts();
    
    const [similarProducts, setSimilarProducts] = useState([]);
    const [highRatedProducts, setHighRatedProducts] = useState([]);
    const [showToast, setShowToast] = useState(false);

    const isInWishlist = product && wishlist.find(item => item.id === product.id);

    const [selectedVariants, setSelectedVariants] = useState({});

    useEffect(() => {
        if (product && product.variantHeadings && product.variantHeadings.length > 0) {
            const initial = {};
            product.variantHeadings.forEach(vh => {
                if (vh.options && vh.options.length > 0) {
                    initial[vh.name] = vh.options[0].name;
                }
            });
            setSelectedVariants(initial);
        }
    }, [product]);

    const handleAddToCart = () => {
        addToCart(product, selectedVariants);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleBuyNow = () => {
        addToCart(product, selectedVariants);
        navigate('/checkout');
    };
    const [reviews, setReviews] = useState([]);
    const [questions, setQuestions] = useState([
        { id: 1, q: 'Is this skin friendly?', a: 'Yes, it is anti-allergic and safe for all skin types.', user: 'Sonal M.' }
    ]);

    // Fetch Reviews from backend
    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;
            try {
                const { data } = await API.get(`/reviews/product/${id}`);
                setReviews(data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };
        fetchReviews();
    }, [id]);

    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
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

    const offers = [
        { type: 'Bank Offer', text: '5% Unlimited Cashback on Flipkart Axis Bank Credit Card' },
        { type: 'Bank Offer', text: '10% Off on Bank of Baroda Mastercard debit card first time transaction' },
        { type: 'Special Price', text: 'Get extra 20% off (price inclusive of cashback/coupon)' },
        { type: 'Partner Offer', text: 'Sign up for Flipkart Pay Later and get Flipkart Gift Card worth ₹100*' }
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
        if (product && products.length > 0) {
             // Find similar products
            const similar = products.filter(p => p.category === product.category && p.id !== product.id);
            setSimilarProducts(similar);
            // Find high rated products in Fashion/Jewelry
            const highRated = products.filter(p => p.rating >= 4.0 && p.id !== product.id).slice(0, 6);
            setHighRatedProducts(highRated);
        }
    }, [product, products]);

    if (loading || !product) return <ProductSkeleton />;

    const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
            {/* ============================================================== */}
            {/* DESKTOP VIEW (Visible only on md+)                           */}
            {/* ============================================================== */}
            <div className="hidden md:block max-w-[1600px] mx-auto p-6 animate-in fade-in duration-500">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
                    <span className="material-icons text-[12px] text-gray-400">chevron_right</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">{product.category}</span>
                    <span className="material-icons text-[12px] text-gray-400">chevron_right</span>
                    <span className="text-gray-800 font-bold truncate max-w-[300px]">{product.name}</span>
                </div>

                <div className="flex gap-10 items-start">
                    {/* LEFT COLUMN: Gallery & Buttons */}
                    <div className="w-[40%] flex-shrink-0 sticky top-24">
                        <div className="flex gap-4">
                            {/* Thumbnails Strip */}
                            <div className="flex flex-col gap-3 h-[450px] overflow-y-auto no-scrollbar w-16 flex-shrink-0">
                                {productImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onMouseEnter={() => setCurrentImageIndex(idx)}
                                        className={`w-16 h-16 border-2 rounded-lg p-1 cursor-pointer transition-all ${currentImageIndex === idx ? 'border-blue-600' : 'border-gray-200 hover:border-blue-400'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain" />
                                    </div>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 h-[450px] border border-gray-100 rounded-xl flex items-center justify-center p-4 relative group bg-white shadow-sm hover:shadow-md transition-shadow">
                                <img src={productImages[currentImageIndex]} alt={product.name} className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" />
                                <button onClick={() => toggleWishlist(product)} className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform text-gray-400 hover:text-red-500">
                                    <span className={`material-icons ${isInWishlist ? 'text-red-500' : ''}`}>{isInWishlist ? 'favorite' : 'favorite'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Desktop Action Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button onClick={handleAddToCart} className="flex-1 bg-[#ff9f00] text-white font-bold py-4 rounded-sm shadow-sm hover:bg-[#f39801] active:scale-[0.98] transition-all text-base uppercase tracking-wide flex items-center justify-center gap-2">
                                <span className="material-icons text-[20px]">shopping_cart</span>
                                Add to Cart
                            </button>
                            <button onClick={handleBuyNow} className="flex-1 bg-[#fb641b] text-white font-bold py-4 rounded-sm shadow-sm hover:bg-[#e85d19] active:scale-[0.98] transition-all text-base uppercase tracking-wide flex items-center justify-center gap-2">
                                <span className="material-icons text-[20px]">flash_on</span>
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Info & Details */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-2">
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1 hover:text-blue-600 cursor-pointer w-fit">{product.brand || "Brand Name"}</p>
                            <h1 className="text-2xl font-medium text-gray-900 leading-snug hover:text-blue-600 cursor-pointer transition-colors inline-block">{product.name}</h1>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                {product.description || "This premium product is crafted with high-quality materials to ensure durability and style. Perfect for daily wear or special occasions, it adds a touch of elegance to any outfit."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#388e3c] text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer">
                                {product.rating || 4.2} <span className="material-icons text-[10px]">star</span>
                            </span>
                            <span className="text-gray-500 text-sm font-medium">1,245 Ratings & 189 Reviews</span>
                            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-5" />
                        </div>

                        <p className="text-green-600 text-sm font-bold mb-1">Special Price</p>
                        <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-3xl font-medium text-gray-900">₹{product.price.toLocaleString()}</span>
                            <span className="text-gray-500 line-through text-base">₹{product.originalPrice.toLocaleString()}</span>
                            <span className="text-green-600 font-bold text-base">{discountPercentage}% off</span>
                        </div>

                        {/* Offers - Desktop */}
                        <div className="mb-6 space-y-2">
                            <p className="text-sm font-bold text-gray-900 mb-2">Available offers</p>
                            {offers.map((offer, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="material-icons text-[#388e3c] text-[16px] mt-0.5">local_offer</span>
                                    <div>
                                        <span className="font-bold text-gray-800">{offer.type}</span>
                                        <span className="ml-1">{offer.text}</span>
                                        <span className="text-blue-600 font-medium cursor-pointer ml-1">T&C</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dynamic Variants Desktop */}
                        <div className="space-y-6 mb-8">
                            {product.variantHeadings?.map((vh) => (
                                <div key={vh.id} className="flex gap-4">
                                    <span className="text-gray-500 font-medium text-sm w-12 pt-1">{vh.name}</span>
                                    <div className="flex flex-wrap gap-2 max-w-[500px]">
                                        {vh.options?.map((opt, idx) => (
                                            vh.hasImage ? (
                                                <div
                                                    key={idx}
                                                    onClick={() => setSelectedVariants(prev => ({ ...prev, [vh.name]: opt.name }))}
                                                    className={`w-14 h-16 rounded border-2 p-0.5 cursor-pointer transition-all hover:scale-105 ${selectedVariants[vh.name] === opt.name ? 'border-blue-600' : 'border-transparent'}`}
                                                >
                                                    <img src={opt.image} alt={opt.name} className="w-full h-full object-cover rounded-[2px]" />
                                                </div>
                                            ) : (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedVariants(prev => ({ ...prev, [vh.name]: opt.name }))}
                                                    className={`min-w-[50px] h-10 px-3 rounded-sm border-2 font-bold text-sm transition-all ${selectedVariants[vh.name] === opt.name
                                                        ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                                                        : 'border-gray-300 text-gray-900 hover:border-blue-400'
                                                        }`}
                                                >
                                                    {opt.name}
                                                </button>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Delivery & Seller - Desktop */}
                        <div className="flex gap-16 mb-6">
                            {/* Delivery */}
                            <div className="flex gap-4">
                                <span className="text-gray-500 font-medium text-sm w-12 pt-1">Delivery</span>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-0.5 max-w-[200px]">
                                        <span className="material-icons text-[18px] text-gray-400">location_on</span>
                                        <input
                                            type="text"
                                            value={product.pincode || '364515'}
                                            readOnly
                                            className="font-bold text-gray-900 text-sm outline-none w-full"
                                        />
                                        <button className="text-blue-600 text-[11px] font-bold uppercase whitespace-nowrap hover:text-blue-700">Check</button>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-bold text-gray-900">Delivery by {product.deliveryDate || '30 Jan, Fri'}</span>
                                        <span className="text-gray-400 mx-1">|</span>
                                        <span className="text-green-600 font-bold">Free</span>
                                        <span className="text-gray-400 line-through text-xs ml-1">₹40</span>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Services */}
                        {/* Services - Desktop (Replicating Mobile Style) */}
                        <div className="flex gap-8 mb-8 mt-2">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800 transition-colors group-hover:bg-blue-50">
                                    <span className="material-icons-outlined text-[24px] group-hover:text-blue-600">autorenew</span>
                                </div>
                                <div className="text-gray-800">
                                    <span className="text-[14px] font-bold leading-tight block">10-Day Return</span>
                                    <span className="text-xs text-gray-500">Easy returns</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800 transition-colors group-hover:bg-blue-50">
                                    <span className="material-icons-outlined text-[24px] group-hover:text-blue-600">payments</span>
                                </div>
                                <div className="text-gray-800">
                                    <span className="text-[14px] font-bold leading-tight block">Cash on Delivery</span>
                                    <span className="text-xs text-gray-500">Pay at doorstep</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800 transition-colors group-hover:bg-blue-50">
                                    <span className="material-icons-outlined text-[24px] group-hover:text-blue-600">shield</span>
                                </div>
                                <div className="text-gray-800">
                                    <span className="text-[14px] font-bold leading-tight block">Flipkart Assured</span>
                                    <span className="text-xs text-gray-500">Quality checked</span>
                                </div>
                            </div>
                        </div>




                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* MOBILE VIEW (Wrapped to hide on md+)                           */}
            {/* ============================================================== */}
            <div className="md:hidden">
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

                {/* Dynamic Variants Mobile */}
                <div className="space-y-6">
                    {product.variantHeadings?.map((vh) => (
                        <div key={vh.id} className="px-4 mt-6">
                            <p className="text-[14px] font-bold text-gray-900 mb-3 uppercase tracking-tight">
                                {vh.name}: <span className="font-normal text-gray-600 normal-case">{selectedVariants[vh.name]}</span>
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {vh.options?.map((opt, idx) => (
                                    vh.hasImage ? (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedVariants(prev => ({ ...prev, [vh.name]: opt.name }))}
                                            className={`min-w-[70px] aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedVariants[vh.name] === opt.name ? 'border-black shadow-sm' : 'border-gray-100'}`}
                                        >
                                            <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedVariants(prev => ({ ...prev, [vh.name]: opt.name }))}
                                            className={`min-w-[48px] h-[36px] px-3 rounded-lg flex items-center justify-center text-[12px] font-bold border transition-all ${selectedVariants[vh.name] === opt.name
                                                ? 'border-black bg-white text-gray-900 shadow-sm'
                                                : 'border-gray-200 text-gray-900'
                                                }`}
                                        >
                                            {opt.name}
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Offers Section */}
                <div className="px-4 mt-4">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-3">Available offers</h3>
                    <div className="space-y-3">
                        {offers.slice(0, 4).map((offer, idx) => (
                            <div key={idx} className="flex gap-2 items-start text-sm text-gray-700">
                                <span className="material-icons text-[#388e3c] text-[16px] mt-0.5 shrink-0">local_offer</span>
                                <div>
                                    <span className="font-bold text-gray-800">{offer.type}</span>
                                    <span className="ml-1 leading-snug">{offer.text}</span>
                                    <span className="text-blue-600 font-medium cursor-pointer ml-1 whitespace-nowrap">T&C</span>
                                </div>
                            </div>
                        ))}
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
            </div>

            {/* Close Mobile Wrapper */}


            {/* Similar Products Section - Added as requested */}
            <div className="md:max-w-[1600px] md:mx-auto md:px-6">
                <ProductSection
                    title="Similar Products"
                    products={similarProducts}
                    loading={productsLoading}
                    containerClass="mt-4 pb-4 px-4 md:px-0"
                    onViewAll={() => console.log('View all similar products')}
                />

                {/* Product Highlights Section */}
                <div className="border-t border-gray-100 mt-2">
                    {/* Desktop Header */}
                    <div className="hidden md:block px-4 md:px-0 py-4">
                        <h3 className="text-[17px] md:text-2xl font-bold text-gray-900 leading-tight">Product highlights</h3>
                    </div>
                    {/* Mobile Header */}
                    <div
                        className="px-4 py-4 flex items-center justify-between cursor-pointer md:hidden"
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

                    <div className={`px-4 md:px-0 pb-6 animate-in fade-in slide-in-from-top-2 duration-300 ${expandedSections.highlights ? '' : 'hidden'} md:block`}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
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
                </div>

                {/* All Details Section - Tabbed Interface with Main Dropdown */}
                <div className="border-t border-gray-100 mt-2">
                    {/* Desktop Header */}
                    <div className="hidden md:block px-4 md:px-0 py-4">
                        <h3 className="text-[17px] md:text-2xl font-bold text-gray-900 leading-tight">All details</h3>
                    </div>
                    {/* Mobile Header */}
                    <div
                        className="px-4 py-4 flex items-center justify-between cursor-pointer md:hidden"
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

                    <div className={`pb-8 animate-in fade-in slide-in-from-top-2 duration-300 ${expandedSections.allDetails ? '' : 'hidden'} md:block`}>
                        {/* Tab Headers */}
                        <div className="px-4 md:px-0 mb-4">
                            <div className="flex overflow-x-auto gap-2.5 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2">
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
                        <div className="px-4 md:px-0 animate-in fade-in zoom-in-95 duration-200">
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
                </div>

                {/* Similar Oversized Studs Section */}
                <div className="border-t border-gray-100 mt-4">
                    <ProductSection
                        title={`Similar ${product.brand || ''} Styles`}
                        products={similarProducts.slice(0, 6)}
                        loading={productsLoading}
                        containerClass="mt-2 pb-4 px-4 md:px-0"
                        onViewAll={() => console.log('View all similar styles')}
                    />
                </div>

                {/* Top Rated Section */}
                <div className="border-t border-gray-100">
                    <ProductSection
                        title="Earrings rated 4 stars and above"
                        products={highRatedProducts}
                        loading={productsLoading}
                        containerClass="mt-2 pb-8 px-4 md:px-0"
                        onViewAll={() => console.log('View all top rated')}
                    />
                </div>

                {/* Ratings and Reviews Section */}
                <div className="border-t border-gray-100 mt-2">
                    {/* Desktop Header */}
                    <div className="hidden md:block px-4 md:px-0 py-4">
                        <h3 className="text-[17px] md:text-2xl font-bold text-gray-900 leading-tight">Ratings and reviews</h3>
                    </div>
                    {/* Mobile Header */}
                    <div
                        className="px-4 py-5 flex items-center justify-between cursor-pointer md:hidden"
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

                    <div className={`pb-6 animate-in fade-in slide-in-from-top-2 duration-300 ${expandedSections.reviews ? '' : 'hidden'} md:block`}>
                        {/* Horizontal Reviews Slide - Narrower cards */}
                        <div className="flex overflow-x-auto gap-3 no-scrollbar px-4 md:px-0 mb-6">
                            {reviews.map(rev => (
                                <div key={rev._id || rev.id} className="min-w-[220px] w-[220px] bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-shrink-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                            {rev.rating} <span className="material-icons text-[9px]">star</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-800 line-clamp-1">{rev.name || rev.user}</span>
                                    </div>
                                    <p className="text-[13px] text-gray-600 mb-2 line-clamp-3 leading-relaxed">{rev.comment}</p>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : (rev.date || 'Recently')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Post Review Form - Smaller Stars */}
                        <div className="mx-4 md:mx-0 p-5 bg-gray-50/50 rounded-3xl border border-gray-100 shadow-sm">
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
                                onClick={async () => {
                                    if (!newReview.comment) return;
                                    setSubmittingReview(true);
                                    try {
                                        await API.post('/reviews', {
                                            productId: id,
                                            rating: newReview.rating,
                                            comment: newReview.comment
                                        });
                                        setNewReview({ rating: 5, comment: '' });
                                        toast.success("Your review has been submitted for approval!");
                                    } catch (err) {
                                        console.error("Error posting review:", err);
                                        toast.error(err.response?.data?.message || "Failed to post review. Please login.");
                                    } finally {
                                        setSubmittingReview(false);
                                    }
                                }}
                                disabled={submittingReview}
                                className={`w-full bg-[#1084ea] text-white font-bold py-3 rounded-2xl text-[13px] active:scale-95 transition-all shadow-md ${submittingReview ? 'opacity-50' : ''}`}
                            >
                                {submittingReview ? 'Submitting...' : 'Post Review'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Questions and Answers Section - Input Only */}
                <div className="border-t border-gray-100 pb-2">
                    {/* Desktop Header */}
                    <div className="hidden md:block px-4 md:px-0 py-4">
                        <h3 className="text-[17px] md:text-2xl font-bold text-gray-900 leading-tight">Questions and Answers</h3>
                    </div>
                    {/* Mobile Header */}
                    <div
                        className="px-4 py-5 flex items-center justify-between cursor-pointer md:hidden"
                        onClick={() => toggleSection('questions')}
                    >
                        <h3 className="text-[17px] font-bold text-gray-900 leading-tight">Questions and Answers</h3>
                        <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center transition-transform duration-300 ${expandedSections.questions ? 'rotate-180' : ''}`}>
                            <span className="material-icons text-gray-600 text-[20px]">expand_more</span>
                        </div>
                    </div>

                    <div className={`px-4 md:px-0 pb-6 animate-in fade-in slide-in-from-top-2 duration-300 ${expandedSections.questions ? '' : 'hidden'} md:block`}>
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
                </div>

                {/* Recently Viewed Section */}
                <div className="border-t border-gray-100 mt-2">
                    <ProductSection
                        title="Recently Viewed"
                        products={products.slice(0, 6)}
                        loading={productsLoading}
                        containerClass="mt-2 pb-4 px-4 md:px-0"
                        onViewAll={() => console.log('View all recently viewed')}
                    />
                </div>

                {/* You may also like Section - Tighter padding */}
                <div className="border-t border-gray-100">
                    <ProductSection
                        title="You may also like"
                        titleBadge="AD"
                        products={products.slice(6, 12)}
                        loading={productsLoading}
                        containerClass="mt-2 pb-4 px-4 md:px-0"
                        onViewAll={() => console.log('View all recommendations')}
                    />
                </div>
            </div>

            {/* Bottom Actions - Fixed Footer */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 flex gap-2 z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
            {
                showToast && (
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
                )
            }
        </div >
    );
};

export default ProductDetails;
