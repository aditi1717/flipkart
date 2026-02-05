import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import ProductSection from '../components/home/ProductSection';
import { useProduct, useProducts } from '../../../hooks/useData';
import { useGoogleTranslation } from '../../../hooks/useGoogleTranslation';
import API from '../../../services/api';
import toast from 'react-hot-toast';
import './ProductDetails.css';

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
    const { addToCart, wishlist, toggleWishlist, addresses } = useCartStore();
    
    // Fetch individual product
    const { product, loading } = useProduct(id);

    // Translation Hooks
    const translatedName = useGoogleTranslation(product?.name);
    // Static Text Translations
    const homeText = useGoogleTranslation('Home');
    const addToCartText = useGoogleTranslation('Add to Cart');
    const outOfStockText = useGoogleTranslation('Out of Stock');
    const buyNowText = useGoogleTranslation('Buy Now');
    const checkText = useGoogleTranslation('Check');
    const freeText = useGoogleTranslation('Free');
    const deliverByText = useGoogleTranslation('Delivery by');
    const specialPriceText = useGoogleTranslation('Special Price');
    const availableOffersText = useGoogleTranslation('Available offers');
    const deliveryText = useGoogleTranslation('Delivery');
    const specificationsText = useGoogleTranslation('Specifications');
    const productDescriptionText = useGoogleTranslation('Product Description');
    const ratingsAndReviewsText = useGoogleTranslation('Ratings and reviews');
    const rateThisProductText = useGoogleTranslation('Rate this product');
    const ratingsText = useGoogleTranslation('Ratings');
    const reviewsText = useGoogleTranslation('Reviews');
    const offText = useGoogleTranslation('off');
    const notDeliverableText = useGoogleTranslation('Not deliverable in your area');
    const codNotAvailableText = useGoogleTranslation('COD Not Available');
    const cashOnDeliveryText = useGoogleTranslation('Cash on Delivery');
    const onlinePaymentOnlyText = useGoogleTranslation('Online payment only');
    const payAtDoorstepText = useGoogleTranslation('Pay at doorstep');
    const daysReturnText = useGoogleTranslation('-Day Return');
    const easyReturnsText = useGoogleTranslation('Easy returns');
    const warrantyDetailsText = useGoogleTranslation('Warranty details');
    const currentlyNotAvailableText = useGoogleTranslation('Currently not available at this location');
    const noReviewsText = useGoogleTranslation('No reviews yet. Be the first to review!');
    const shareExperienceText = useGoogleTranslation('Share your experience...');
    const highlightsText = useGoogleTranslation('Highlights');
    const viewAllReviewsText = useGoogleTranslation('View All Reviews');

    // Note: Complex descriptions might need more granular translation, 
    // but for now we'll translate the main name which is key.

    // Fetch all products for "Similar" and "High Rated" logic (could be optimized on backend)
    const { products, loading: productsLoading } = useProducts();
    
    const [similarProducts, setSimilarProducts] = useState([]);
    const [similarStyles, setSimilarStyles] = useState([]);
    const [highRatedProducts, setHighRatedProducts] = useState([]);
    const [showToast, setShowToast] = useState(false);
    
    // PIN Code State
    const [pincode, setPincode] = useState('');
    const [pincodeStatus, setPincodeStatus] = useState(null); // { message: '', isServiceable: bool, deliveryDate: '' }
    const [checkingPincode, setCheckingPincode] = useState(false);

    const handleCheckPincode = async (codeOverride = null) => {
        const codeToCheck = codeOverride || pincode;
        if (!codeToCheck || codeToCheck.length < 6) {
            if (!codeOverride) toast.error('Please enter a valid 6-digit PIN code');
            return;
        }
        setCheckingPincode(true);
        try {
            const { data } = await API.get(`/pincodes/check/${codeToCheck}`);
            if (data.isServiceable) {
                setPincodeStatus({
                    isServiceable: true,
                    message: data.message || `Delivered in ${data.deliveryTime} ${data.unit}`,

                    deliveryDate: data.deliveryTime + ' ' + data.unit,
                    isCOD: data.isCOD
                });
            } else {
                setPincodeStatus({
                    isServiceable: false,
                    message: data.message || 'Not deliverable to this location',
                    deliveryDate: null
                });
                if (!codeOverride) toast.error(data.message || 'Not deliverable to this location');
            }
        } catch (error) {
            console.error('Pincode Check Error:', error);
            setPincodeStatus({
                isServiceable: false,
                message: 'Area not serviceable',
                deliveryDate: null
            });
            if (!codeOverride) toast.error('Service not available in this area');
        } finally {
            setCheckingPincode(false);
        }
    };

    // Auto-check pincode if address exists
    useEffect(() => {
        if (addresses && addresses.length > 0 && !pincode && !pincodeStatus) {
            const firstAddr = addresses[0];
            if (firstAddr.pincode) {
                setPincode(firstAddr.pincode);
                handleCheckPincode(firstAddr.pincode);
            }
        }
    }, [addresses, product]);

    const isInWishlist = product && wishlist.find(item => item.id === product.id);

    const [selectedVariants, setSelectedVariants] = useState({});

    const displayVariantHeadings = React.useMemo(() => {
        if (!product) return [];
        if (product.variantHeadings && product.variantHeadings.length > 0) return product.variantHeadings;
        
        const fallback = [];
        if (product.colors && product.colors.length > 0) {
            fallback.push({ 
                id: 'color-fallback', 
                name: 'Color', 
                hasImage: true, 
                options: product.colors.map(c => typeof c === 'string' ? { name: c, image: '' } : c) 
            });
        }
        if (product.sizes && product.sizes.length > 0) {
            fallback.push({ 
                id: 'size-fallback', 
                name: product.variantLabel || 'Size', 
                hasImage: false, 
                options: product.sizes.map(s => typeof s === 'string' ? { name: s } : s) 
            });
        }
        return fallback;
    }, [product]);

    useEffect(() => {
        if (product && displayVariantHeadings.length > 0) {
            const initial = {};
            displayVariantHeadings.forEach(vh => {
                if (vh.options && vh.options.length > 0) {
                    initial[vh.name] = vh.options[0].name;
                }
            });
            setSelectedVariants(initial);
        }
    }, [product, displayVariantHeadings]);

    const currentStock = React.useMemo(() => {
        if (!product) return 0;
        
        if (displayVariantHeadings.length > 0 && product.skus && product.skus.length > 0) {
            const matchingSku = product.skus.find(sku => {
                // Every selected variant must match the SKU combination
                return displayVariantHeadings.every(vh => 
                    sku.combination[vh.name] === selectedVariants[vh.name]
                );
            });
            return matchingSku ? matchingSku.stock : 0;
        }
        
        return product.stock || 0;
    }, [product, selectedVariants, displayVariantHeadings]);

    const productImages = React.useMemo(() => {
        if (!product) return [];
        
        const images = [
            product.image,
            ...(Array.isArray(product.images) ? product.images : [])
        ];

        // Add images from variant headings
        displayVariantHeadings.forEach(vh => {
            if (vh.hasImage && vh.options) {
                vh.options.forEach(opt => {
                    if (opt.image) images.push(opt.image);
                });
            }
        });

        return Array.from(new Set(images)).filter(Boolean);
    }, [product, displayVariantHeadings]);

    const handleVariantSelect = (vhName, optName, optImage) => {
        setSelectedVariants(prev => ({ ...prev, [vhName]: optName }));
        
        if (optImage) {
            const imgIndex = productImages.indexOf(optImage);
            if (imgIndex !== -1) {
                setCurrentImageIndex(imgIndex);
            }
        }
    };

    const handleAddToCart = () => {
        addToCart(product, selectedVariants);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleBuyNow = () => {
        if (addresses.length === 0) {
            const shouldRedirect = window.confirm(
                '📍 Please add a delivery address before checkout.\n\nWould you like to add one now?'
            );
            if (shouldRedirect) {
                navigate('/addresses');
            }
            return;
        }
        // Instead of adding to cart, pass item directly to checkout via state
        navigate('/checkout', { 
            state: { 
                buyNowItem: { 
                    ...product, 
                    variant: selectedVariants, 
                    quantity: 1 
                } 
            } 
        });
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
    
    // Derived State for Ratings
    const totalRatings = reviews.length;
    const averageRating = totalRatings > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1)
        : (product?.rating || 4.2);

    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');

    const [expandedSections, setExpandedSections] = useState({
        highlights: false,
        allDetails: false,
        reviews: false,
        questions: false
    });
    const [selectedDetailTab, setSelectedDetailTab] = useState('Manufacturer');
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bankOffers, setBankOffers] = useState([]);

    useEffect(() => {
        if (id) {
            const fetchBankOffers = async () => {
                try {
                    const { data } = await API.get(`/bank-offers/product/${id}`);
                    setBankOffers(data);
                } catch (error) {
                    console.error('Error fetching bank offers', error);
                }
            };
            fetchBankOffers();
        }
    }, [id]);

    const offers = [
        ...bankOffers.map(offer => ({
            type: `${offer.bankName} Offer`,
            text: `${offer.offerName} - Get ${offer.discountType === 'flat' ? 'Flat ₹' + offer.discountValue : offer.discountValue + '%'} Off. ${offer.description || ''}`
        }))
    ];



    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (product && products.length > 0) {
             // Find similar products by Category
            const similar = products.filter(p => p.category === product.category && p.id !== product.id);
            setSimilarProducts(similar);

            // Find similar products by Sub-Category (Styles)
            if (product.subCategories && product.subCategories.length > 0) {
                const subIds = product.subCategories.map(s => s._id || s.id);
                const styles = products.filter(p => {
                    if (p.id === product.id) return false;
                    if (!p.subCategories || p.subCategories.length === 0) return false;
                    return p.subCategories.some(s => subIds.includes(s._id || s.id));
                });
                setSimilarStyles(styles);
            } else {
                setSimilarStyles([]);
            }

            // Find high rated products in same category
            const highRated = products.filter(p => p.category === product.category && p.rating >= 4.0 && p.id !== product.id).slice(0, 6);
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
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate('/')}>{homeText}</span>
                    <span className="material-icons text-[12px] text-gray-400">chevron_right</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate(`/search?category=${product.category}`)}>{product.category}</span>
                    {product.subCategories && product.subCategories.length > 0 && (
                        <>
                            <span className="material-icons text-[12px] text-gray-400">chevron_right</span>
                            <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate(`/search?subcategory=${product.subCategories[0].name}`)}>
                                {product.subCategories[0].name}
                            </span>
                        </>
                    )}
                    <span className="material-icons text-[12px] text-gray-400">chevron_right</span>
                    <span className="text-gray-800 font-bold truncate max-w-[300px]">{product.name}</span>
                </div>

                <div className="flex gap-10 items-start">
                    {/* LEFT COLUMN: Gallery & Buttons */}
                    <div className="w-[40%] flex-shrink-0 sticky top-[110px] self-start">
                        <div className="flex gap-4">
                            {/* Thumbnails Strip */}
                            {productImages.length > 1 && (
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
                            )}

                            {/* Main Image */}
                            <div className="flex-1 h-[450px] border border-gray-100 rounded-xl flex items-center justify-center p-4 relative group bg-white shadow-sm hover:shadow-md transition-shadow">
                                {productImages.length > 0 ? (
                                    <img 
                                        src={productImages[currentImageIndex] || productImages[0]} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                        <span className="material-icons text-6xl">image_not_supported</span>
                                    </div>
                                )}
                                <button onClick={() => toggleWishlist(product)} className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform text-gray-400 hover:text-red-500">
                                    <span className={`material-icons ${isInWishlist ? 'text-red-500' : ''}`}>favorite</span>
                                </button>
                            </div>
                        </div>

                        {/* Desktop Action Buttons */}
                        <div className="flex gap-4 mt-6">
                            {pincodeStatus?.isServiceable === false ? (
                                <div className="flex-1 bg-red-50 border border-red-100 p-4 rounded-sm text-center">
                                    <p className="text-red-600 font-bold uppercase tracking-tight text-sm flex items-center justify-center gap-2">
                                        <span className="material-icons text-red-500 text-[18px]">location_off</span>
                                        {notDeliverableText}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <button 
                                        onClick={handleAddToCart} 
                                        disabled={currentStock <= 0}
                                        className={`flex-1 font-bold py-4 rounded-sm shadow-sm active:scale-[0.98] transition-all text-base uppercase tracking-wide flex items-center justify-center gap-2 ${
                                            currentStock > 0 
                                            ? 'bg-[#ff9f00] text-white hover:bg-[#f39801]' 
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                        }`}
                                    >
                                        <span className="material-icons text-[20px]">{currentStock > 0 ? 'shopping_cart' : 'info'}</span>
                                        {currentStock > 0 ? addToCartText : outOfStockText}
                                    </button>
                                    <button 
                                        onClick={handleBuyNow} 
                                        disabled={currentStock <= 0}
                                        className={`flex-1 font-bold py-4 rounded-sm shadow-sm active:scale-[0.98] transition-all text-base uppercase tracking-wide flex items-center justify-center gap-2 ${
                                            currentStock > 0 
                                            ? 'bg-[#fb641b] text-white hover:bg-[#e85d19]' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        }`}
                                    >
                                        <span className="material-icons text-[20px]">{currentStock > 0 ? 'flash_on' : 'remove_shopping_cart'}</span>
                                        {currentStock > 0 ? buyNowText : outOfStockText}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Info & Details */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-2">
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1 hover:text-blue-600 cursor-pointer w-fit">{product.brand || "Brand Name"}</p>
                            <h1 className="text-2xl font-medium text-gray-900 leading-snug hover:text-blue-600 cursor-pointer transition-colors inline-block">
                                {translatedName}
                                {displayVariantHeadings.length > 0 && (
                                    <span className="text-gray-500 ml-1">
                                        ({displayVariantHeadings.map(vh => selectedVariants[vh.name]).filter(Boolean).join(', ')})
                                    </span>
                                )}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#388e3c] text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer">
                                {averageRating} <span className="material-icons text-[10px]">star</span>
                            </span>
                            <span className="text-gray-500 text-sm font-medium">{totalRatings.toLocaleString()} {ratingsText} & {totalRatings.toLocaleString()} {reviewsText}</span>
                        </div>

                        <p className="text-green-600 text-sm font-bold mb-1">{specialPriceText}</p>
                        <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-3xl font-medium text-gray-900">₹{product.price.toLocaleString()}</span>
                            <span className="text-gray-500 line-through text-base">₹{product.originalPrice.toLocaleString()}</span>
                            <span className="text-green-600 font-bold text-base">{discountPercentage}% {offText}</span>
                        </div>

                        {/* Dynamic Variants Desktop */}
                        {displayVariantHeadings.length > 0 && (
                            <div className="space-y-6 mb-8 mt-6">
                                {displayVariantHeadings.map((vh) => (
                                    <div key={vh.id} className="flex gap-4">
                                        <span className="text-gray-500 font-medium text-sm w-20 pt-1 uppercase tracking-wider text-[11px] font-bold">{vh.name}</span>
                                        <div className="flex flex-wrap gap-2 max-w-[500px]">
                                            {vh.options?.map((opt, idx) => (
                                                vh.hasImage ? (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleVariantSelect(vh.name, opt.name, opt.image)}
                                                        className={`w-14 h-16 rounded border-2 p-0.5 cursor-pointer transition-all hover:scale-105 ${selectedVariants[vh.name] === opt.name ? 'border-blue-600' : 'border-transparent'}`}
                                                    >
                                                        <img src={opt.image} alt={opt.name} className="w-full h-full object-cover rounded-[2px]" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleVariantSelect(vh.name, opt.name)}
                                                        className={`min-w-[50px] h-10 px-4 rounded-sm border-2 font-bold text-sm transition-all ${selectedVariants[vh.name] === opt.name
                                                            ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                                                            : 'border-gray-200 text-gray-900 hover:border-blue-400'
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
                        )}

                        {/* Offers - Desktop */}
                        <div className="mb-6 space-y-2">
                            <p className="text-sm font-bold text-gray-900 mb-2">{availableOffersText}</p>
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

                        {/* Delivery & Seller - Desktop */}
                        <div className="flex gap-16 mb-6">
                            {/* Delivery */}
                            <div className="flex gap-4">
                                <span className="text-gray-500 font-medium text-sm w-12 pt-1">{deliveryText}</span>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-0.5 max-w-[200px]">
                                        <span className="material-icons text-[18px] text-gray-400">location_on</span>
                                        <input
                                            type="text"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            placeholder="Enter Pincode"
                                            maxLength={6}
                                            className="font-bold text-gray-900 text-sm outline-none w-full placeholder:text-gray-400"
                                        />
                                        <button 
                                            onClick={() => handleCheckPincode()}
                                            disabled={checkingPincode}
                                            className="text-blue-600 text-[11px] font-bold uppercase whitespace-nowrap hover:text-blue-700 disabled:opacity-50"
                                        >
                                            {checkingPincode ? '...' : checkText}
                                        </button>
                                    </div>
                                    <div className="text-sm">
                                        <span className={`font-bold ${pincodeStatus ? (pincodeStatus.isServiceable ? 'text-gray-900' : 'text-red-600') : 'text-gray-500'}`}>
                                            {pincodeStatus ? pincodeStatus.message : `Delivery by ${product.deliveryDate || '7 days'}`}
                                        </span>
                                        {pincodeStatus?.isServiceable && (
                                            <>
                                                <span className="text-gray-400 mx-1">|</span>
                                                <span className="text-green-600 font-bold">{freeText}</span>
                                                <span className="text-gray-400 line-through text-xs ml-1">₹40</span>
                                            </>
                                        )}
                                    </div>
                                    {!pincodeStatus?.isServiceable && pincodeStatus && (
                                         <p className="text-xs text-red-500 font-medium">
                                            {currentlyNotAvailableText}
                                         </p>
                                    )}
                                </div>
                            </div>
                        </div>



                        {/* Services - Desktop */}
                        <div className="flex gap-8 mb-8 mt-2">
                            {product.returnPolicy && (
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800 transition-colors group-hover:bg-blue-50">
                                        <span className="material-icons-outlined text-[24px] group-hover:text-blue-600">autorenew</span>
                                    </div>
                                    <div className="text-gray-800">
                                        <span className="text-[14px] font-bold leading-tight block">{product.returnPolicy.days}{daysReturnText}</span>
                                        <span className="text-xs text-gray-500">{easyReturnsText}</span>
                                    </div>
    
                                </div>
                            )}



                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${pincodeStatus?.isCOD === false ? 'bg-red-50 text-red-500' : 'bg-[#f5f5f5] text-gray-800 group-hover:bg-blue-50'}`}>
                                    <span className="material-icons-outlined text-[24px] group-hover:text-blue-600">
                                        {pincodeStatus?.isCOD === false ? 'money_off' : 'payments'}
                                    </span>
                                </div>
                                <div className="text-gray-800">
                                    <span className={`text-[14px] font-bold leading-tight block ${pincodeStatus?.isCOD === false ? 'text-red-600' : ''}`}>
                                        {pincodeStatus?.isCOD === false ? codNotAvailableText : cashOnDeliveryText}
                                    </span>
                                    <span className="text-xs text-gray-500 px-0.5">
                                        {pincodeStatus?.isCOD === false ? onlinePaymentOnlyText : payAtDoorstepText}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800 transition-colors group-hover:bg-blue-50">
                                    <span className="material-icons-outlined text-[24px] group-hover:text-blue-600">verified_user</span>
                                </div>
                                <div className="text-gray-800">
                                    <span className="text-[14px] font-bold leading-tight block">{product.warranty?.summary || 'Brand Warranty'}</span>
                                    <span className="text-xs text-gray-500">{warrantyDetailsText}</span>
                                </div>
                            </div>
                        </div>


                        {/* Product Highlights - Two Column Grid */}
                        {product.highlights && product.highlights.length > 0 && (
                            <div className="grid grid-cols-2 gap-12 mb-6 mt-6">
                                {product.highlights.map((section, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-gray-500 font-medium text-sm mb-3">{section.heading}</h3>
                                        <ul className="space-y-2">
                                            {section.points.filter(p => p.trim()).map((point, pIdx) => (
                                                <li key={pIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <span className="text-gray-400 mt-1.5 text-xs">●</span>
                                                    <span className="flex-1">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}




                        {/* Product Description Section - Rich Zig-Zag Layout */}
                        {product.description && product.description.length > 0 && (
                            <div className="space-y-12 mt-12 mb-12">
                                <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">{productDescriptionText}</h3>
                                
                                {product.description.map((section, idx) => {
                                    const isEven = idx % 2 === 0;
                                    const hasImage = !!section.image;

                                    return (
                                        <div key={idx} className={`flex flex-col md:flex-row gap-8 items-center ${!isEven && hasImage ? 'md:flex-row-reverse' : ''}`}>
                                            
                                            {/* Text Content */}
                                            <div className={`flex-1 space-y-4 ${hasImage ? '' : 'w-full'}`}>
                                                {section.heading && (
                                                    <h4 className="text-2xl font-semibold text-gray-900 leading-tight">
                                                        {section.heading}
                                                    </h4>
                                                )}
                                                
                                                {section.content && (
                                                    <p className="text-amber-800 text-sm leading-relaxed whitespace-pre-line">
                                                        {section.content}
                                                    </p>
                                                )}

                                                {section.points && section.points.length > 0 && section.points[0] !== '' && (
                                                    <ul className="space-y-2 mt-4">
                                                        {section.points.map((point, pIdx) => (
                                                            point && (
                                                                <li key={pIdx} className="flex items-start gap-3 text-sm text-gray-700">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                                                                    <span className="leading-relaxed">{point}</span>
                                                                </li>
                                                            )
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Image Content */}
                                            {hasImage && (
                                                <div className="w-full md:w-auto md:max-w-[280px] flex-shrink-0">
                                                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                                                        <img 
                                                            src={section.image} 
                                                            alt={section.heading || 'Product Detail'} 
                                                            className="w-full h-auto object-contain" 
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Specifications Section */}
                        {product.specifications && product.specifications.length > 0 && product.specifications[0].groupName && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
                                <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">{specificationsText}</h3>
                                <div className="space-y-6">
                                    {product.specifications.map((group, idx) => (
                                        group.groupName && (
                                            <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-3">{group.groupName}</h4>
                                                <div className="space-y-2">
                                                    {group.specs && group.specs.map((spec, specIdx) => (
                                                        spec.key && spec.value && (
                                                            <div key={specIdx} className="flex items-start gap-4">
                                                                <span className="text-sm text-gray-500 min-w-[140px]">{spec.key}</span>
                                                                <span className="text-sm text-gray-900 font-medium">{spec.value}</span>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ratings and Reviews Section - Desktop Right Column */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">{ratingsAndReviewsText}</h3>
                            
                            {/* Reviews List */}
                            <div className="space-y-4 mb-6">
                                {reviews.length > 0 ? (
                                    reviews.slice(0, 3).map(rev => (
                                        <div key={rev._id || rev.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                    {rev.rating} <span className="material-icons text-[9px]">star</span>
                                                </div>
                                                <span className="text-[13px] font-bold text-gray-800 line-clamp-1">{rev.name || rev.user}</span>
                                            </div>
                                            <p className="text-[13px] text-gray-600 mb-1 leading-relaxed">{rev.comment}</p>
                                            <span className="text-[10px] text-gray-400 font-medium lowercase">
                                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : (rev.date || 'Recently')}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic pb-2">{noReviewsText}</p>
                                )}
                            </div>

                            {/* Post Review Form - Compact */}
                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">{rateThisProductText}</h4>
                                <div className="flex gap-1.5 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${newReview.rating >= star
                                                ? 'bg-[#388e3c] text-white shadow-sm'
                                                : 'bg-white text-gray-300 border border-gray-100'
                                                }`}
                                        >
                                            <span className="material-icons text-[18px]">star</span>
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    placeholder={shareExperienceText}
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                    className="w-full bg-white border border-gray-100 rounded-xl p-3 text-xs focus:ring-2 focus:ring-green-100 outline-none resize-none min-h-[70px] mb-3 shadow-inner"
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
                                    className={`w-full bg-[#1084ea] text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all shadow-sm ${submittingReview ? 'opacity-50' : ''}`}
                                >
                                    {submittingReview ? 'Submitting...' : 'Post Review'}
                                </button>
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

                {/* Product Image Section - Single Image with Thumbnail Gallery */}
                <div className="bg-white">
                    {/* Main Image */}
                    <div className="relative w-full aspect-square bg-white flex items-center justify-center p-4">
                        <img 
                            src={productImages[currentImageIndex] || productImages[0]} 
                            alt={product.name} 
                            className="w-full h-full object-contain" 
                        />
                        
                        {/* Icons - Top Right */}
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <button
                                onClick={() => toggleWishlist(product)}
                                className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100"
                            >
                                <span className={`material-icons text-[20px] ${isInWishlist ? 'text-red-500' : 'text-gray-600'}`}>
                                    {isInWishlist ? 'favorite' : 'favorite_border'}
                                </span>
                            </button>
                            <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100">
                                <span className="material-icons-outlined text-gray-600 text-[20px]">share</span>
                            </button>
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {productImages.length > 1 && (
                        <div className="px-4 pb-4">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-14 h-14 rounded border-2 p-0.5 transition-all ${
                                            currentImageIndex === idx 
                                                ? 'border-blue-600' 
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info - Redesigned */}
                <div className="bg-white border-t-8 border-gray-100 px-4 py-4">
                    {/* Brand */}
                    <div className="mb-1">
                        <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                            {product.brand || 'Brand'}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h1 className="text-gray-900 text-base font-medium leading-snug mb-2">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                            {averageRating}
                            <span className="material-icons text-[10px]">star</span>
                        </div>
                        <span className="text-gray-500 text-xs">
                            {totalRatings.toLocaleString()} {ratingsText} & {totalRatings.toLocaleString()} {reviewsText}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-medium text-gray-900">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                            <>
                                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                <span className="text-sm text-green-600 font-semibold">
                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% {offText}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Dynamic Variants Mobile */}
                    {displayVariantHeadings.length > 0 && (
                        <div className="space-y-4 pb-2">
                            {displayVariantHeadings.map((vh) => (
                                <div key={vh.id}>
                                    <p className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                                        {vh.name}: <span className="font-normal text-gray-600 normal-case">{selectedVariants[vh.name]}</span>
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {vh.options?.map((opt, idx) => (
                                            vh.hasImage ? (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleVariantSelect(vh.name, opt.name, opt.image)}
                                                    className={`w-12 h-14 rounded border-2 p-0.5 transition-all ${
                                                        selectedVariants[vh.name] === opt.name 
                                                            ? 'border-blue-600' 
                                                            : 'border-gray-200'
                                                    }`}
                                                >
                                                    <img src={opt.image} alt={opt.name} className="w-full h-full object-cover rounded-sm" />
                                                </button>
                                            ) : (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleVariantSelect(vh.name, opt.name)}
                                                    className={`h-9 px-3 rounded border-2 font-medium text-xs transition-all ${
                                                        selectedVariants[vh.name] === opt.name
                                                            ? 'border-blue-600 text-blue-600 bg-blue-50'
                                                            : 'border-gray-200 text-gray-700'
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
                    )}
                </div>

                {/* Offers Section */}
                <div className="bg-white border-t-8 border-gray-100 px-4 py-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{availableOffersText}</h3>
                    <div className="space-y-2">
                        {offers.slice(0, 4).map((offer, idx) => (
                            <div key={idx} className="flex gap-2 items-start text-xs text-gray-700">
                                <span className="material-icons text-green-600 text-[16px] mt-0.5 shrink-0">local_offer</span>
                                <div className="flex-1">
                                    <span className="font-semibold text-gray-900">{offer.type}</span>
                                    <span className="ml-1">{offer.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Details Section */}
                <div className="bg-white border-t-8 border-gray-100 px-4 py-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{deliveryText}</h3>

                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        {/* Location Bar */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-icons-outlined text-gray-600 text-[18px]">location_on</span>
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    placeholder="Enter Pincode"
                                    maxLength={6}
                                    className="text-xs font-semibold text-gray-900 bg-transparent outline-none w-full placeholder:text-gray-400"
                                />
                                <button 
                                    onClick={() => handleCheckPincode()}
                                    disabled={checkingPincode}
                                    className="text-xs font-bold text-blue-600 whitespace-nowrap disabled:opacity-50"
                                >
                                    {checkingPincode ? '...' : checkText}
                                </button>
                            </div>
                        </div>

                        {/* Delivery Status */}
                        <div className="flex items-center gap-2 text-xs">
                            <span className="material-icons-outlined text-gray-500 text-[18px]">local_shipping</span>
                            <span className={`font-semibold ${pincodeStatus ? (pincodeStatus.isServiceable ? 'text-gray-900' : 'text-red-600') : 'text-gray-700'}`}>
                                {pincodeStatus ? pincodeStatus.message : `Delivery by ${product.deliveryDate || '7 days'}`}
                            </span>
                        </div>
                        
                        {pincodeStatus?.isServiceable && (
                            <div className="mt-2 text-xs text-green-600 font-medium">
                                {freeText}
                            </div>
                        )}
                    </div>
                </div>

                {/* Service Icons - Mobile */}
                <div className="bg-white border-t-8 border-gray-100 px-4 py-4">
                    <div className="flex justify-between">
                        {product.returnPolicy && (
                            <div className="flex flex-col items-center gap-2.5 w-1/3 group">
                                <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800">
                                    <span className="material-icons-outlined text-[24px]">autorenew</span>
                                </div>
                                <div className="flex items-center text-gray-800">
                                    <span className="text-[11px] font-bold text-center leading-tight">{product.returnPolicy.days}{daysReturnText}</span>
                                    <span className="material-icons text-[14px] text-gray-400 ml-0.5">chevron_right</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-2.5 w-1/3">
                            <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800">
                                <span className="material-icons-outlined text-[24px]">payments</span>
                            </div>
                            <div className="flex items-center text-gray-800">
                                <span className="text-[11px] font-bold text-center leading-tight">{cashOnDeliveryText}</span>
                                <span className="material-icons text-[14px] text-gray-400 ml-0.5">chevron_right</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2.5 w-1/3">
                            <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-gray-800">
                                <span className="material-icons-outlined text-[24px]">verified_user</span>
                            </div>
                            <div className="flex items-center text-gray-800">
                                <span className="text-[11px] font-bold text-center leading-tight">
                                    {product.warranty?.summary ? (
                                        <>
                                            {product.warranty.summary.split(' ').slice(0, 2).join(' ')}<br />
                                            {product.warranty.summary.split(' ').slice(2).join(' ') || warrantyDetailsText}
                                        </>
                                    ) : (
                                        <>{warrantyDetailsText}</>
                                    )}
                                </span>
                                <span className="material-icons text-[14px] text-gray-400 ml-0.5">chevron_right</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Description & Reviews */}
                <div className="mt-4 px-4 space-y-4">
                    {/* Highlights Section */}
                    {product.highlights && product.highlights.length > 0 && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <h3 className="text-[16px] font-bold text-gray-900 mb-4">{highlightsText}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {Array.isArray(product.highlights) ? (
                                    product.highlights.map((section, idx) => {
                                        const validPoints = section.points?.filter(p => p && p.trim().length > 0) || [];
                                        if (!section.heading && validPoints.length === 0) return null;
                                        
                                        return (
                                            <div key={idx}>
                                                {section.heading && <h4 className="font-bold text-gray-800 text-sm mb-2">{section.heading}</h4>}
                                                {validPoints.length > 0 && (
                                                    <ul className="list-disc pl-4 space-y-1">
                                                        {validPoints.map((point, pIdx) => (
                                                            <li key={pIdx} className="text-[13px] text-gray-700">{point}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    /* Fallback for legacy string data */
                                    <div 
                                        className="prose prose-sm max-w-none text-gray-700 text-[13px]"
                                        dangerouslySetInnerHTML={{ __html: product.highlights }}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description Section */}
                    {product.description && product.description.length > 0 && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <h3 className="text-[16px] font-bold text-gray-900 mb-4">{productDescriptionText}</h3>
                            <div className="space-y-4">
                                {product.description.map((section, idx) => (
                                    <div key={idx} className="space-y-3">
                                        {section.heading && (
                                            <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide border-b border-gray-50 pb-2">
                                                {section.heading}
                                            </h4>
                                        )}
                                        <ul className="space-y-2">
                                            {section.points?.map((point, pointIdx) => (
                                                point && (
                                                    <li key={pointIdx} className="flex items-start gap-2 text-[13px] text-gray-800">
                                                        <span className="text-blue-600 mt-1 flex-shrink-0 font-bold">•</span>
                                                        <span className="leading-relaxed font-medium">{point}</span>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ratings Section */}
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div 
                            className="p-5 flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('reviews')}
                        >
                            <div>
                                <h3 className="text-[16px] font-bold text-gray-900">{ratingsAndReviewsText}</h3>
                                <p className="text-[12px] text-gray-500 mt-0.5">
                                    {reviews.length > 0 ? `${reviews.length} ${reviewsText}` : noReviewsText}
                                </p>
                            </div>
                            <span className={`material-icons transition-transform ${expandedSections.reviews ? 'rotate-180' : ''}`}>expand_more</span>
                        </div>
                        
                        {expandedSections.reviews && (
                            <div className="p-5 pt-0 border-t border-gray-50 space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">
                                    {reviews.map(rev => (
                                        <div key={rev._id || rev.id} className="min-w-[200px] bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                    {rev.rating} <span className="material-icons text-[9px]">star</span>
                                                </div>
                                                <span className="text-[12px] font-bold text-gray-800">{rev.name || rev.user}</span>
                                            </div>
                                            <p className="text-[12px] text-gray-600 line-clamp-2 leading-relaxed">{rev.comment}</p>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => navigate(`/reviews/${id}`)}
                                    className="w-full py-2.5 text-blue-600 text-xs font-bold border border-blue-50 bg-blue-50/30 rounded-xl"
                                >
                                    {viewAllReviewsText}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Close Mobile Wrapper */}


            {/* Product Description Section - Above Similar Products */}
            

            {/* Similar Products Section - Added as requested */}
            {similarProducts.length > 0 && (
                <div className="md:max-w-[1600px] md:mx-auto md:px-6">
                    <ProductSection
                        title="Similar Products"
                        products={similarProducts}
                        loading={productsLoading}
                        containerClass="mt-4 pb-4 px-4 md:px-0"
                        onViewAll={() => console.log('View all similar products')}
                    />
                </div>
            )}

            <div className="md:max-w-[1600px] md:mx-auto md:px-6">
                {/* All Details Section - Tabbed Interface with Main Dropdown */}
                
                {/* Similar Styles Section */}
                {similarStyles.length > 0 && (
                    <div className="border-t border-gray-100 mt-4">
                        <ProductSection
                            title={`Similar ${product.subCategories?.[0]?.name || product.brand || ''} Styles`}
                            products={similarStyles}
                            loading={productsLoading}
                            containerClass="mt-2 pb-4 px-4 md:px-0"
                            onViewAll={() => console.log('View all similar styles')}
                        />
                    </div>
                )}

                {/* Top Rated Section */}
                {highRatedProducts.length > 0 && (
                    <div className="border-t border-gray-100">
                        <ProductSection
                            title={`${product.category} rated 4 stars and above`}
                            products={highRatedProducts}
                            loading={productsLoading}
                            containerClass="mt-2 pb-8 px-4 md:px-0"
                            onViewAll={() => console.log('View all top rated')}
                        />
                    </div>
                )}



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
                {pincodeStatus?.isServiceable === false ? (
                    <div className="flex-1 bg-red-50 p-3 rounded-xl text-center">
                        <p className="text-red-600 font-bold uppercase tracking-tight text-xs flex items-center justify-center gap-2">
                            <span className="material-icons text-red-500 text-[16px]">location_off</span>
                            {notDeliverableText}
                        </p>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={handleAddToCart}
                            disabled={currentStock <= 0}
                            className={`flex-1 font-bold py-3.5 rounded-xl text-sm active:scale-[0.98] transition-all ${
                                currentStock > 0 
                                ? 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50' 
                                : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                            }`}
                        >
                            {currentStock > 0 ? addToCartText : outOfStockText}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={currentStock <= 0}
                            className={`flex-1 font-bold py-3.5 rounded-xl text-sm shadow-sm active:scale-[0.98] transition-all ${
                                currentStock > 0 
                                ? 'bg-[#ffc200] text-black hover:bg-[#ffb300]' 
                                : 'bg-gray-100 text-gray-300 shadow-none cursor-not-allowed'
                            }`}
                        >
                            {currentStock > 0 ? buyNowText : outOfStockText}
                        </button>
                    </>
                )}
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
        </div>
    );
};

export default ProductDetails;
