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

    // Dynamic Variants Logic
    const variantLabel = product ? (product.variantLabel || 'Size') : 'Size';

    // Size availability should depend on the selected color if SKUs exist
    const variantOptions = product && product.sizes && product.sizes.length > 0
        ? product.sizes.map(s => {
            const label = typeof s === 'string' ? s : s.label;
            let available = true;
            let stock = null;

            if (product.skus && product.skus.length > 0) {
                const sku = product.skus.find(sku => sku.color === selectedColor && sku.size === label);
                available = sku ? Number(sku.stock) > 0 : false;
                stock = sku ? Number(sku.stock) : 0;
            } else {
                available = typeof s === 'string' ? true : (Number(s.stock) > 0);
                stock = typeof s === 'string' ? null : Number(s.stock);
            }

            return { label, available, stock };
        })
        : [
            { label: 'S', available: true },
            { label: 'M', available: true },
            { label: 'L', available: true },
            { label: 'XL', available: false }
        ];

    const [selectedSize, setSelectedSize] = useState(variantOptions.find(o => o.available)?.label || variantOptions[0]?.label);

    // Current SKU/Combination Stock Calculation
    const currentCombination = product?.skus?.find(s => s.color === selectedColor && s.size === selectedSize);
    const currentStock = currentCombination
        ? Number(currentCombination.stock)
        : (product?.skus?.length > 0 ? 0 : (product?.stock || 0));

    const colors = product && product.colors && product.colors.length > 0
        ? product.colors
        : [
            { name: 'Black', img: 'https://rukminim2.flixcart.com/image/832/832/xif0q/gown/v/h/t/na-s-short-gown-z-atkins-original-imagp8m8zgzgzgze.jpeg' },
            { name: 'Green', img: 'https://rukminim2.flixcart.com/image/832/832/xif0q/gown/i/a/e/na-s-short-gown-z-atkins-original-imagp8m8vfsxhv6f.jpeg' },
            { name: 'Purple', img: 'https://rukminim2.flixcart.com/image/832/832/xif0q/gown/m/3/g/na-s-short-gown-z-atkins-original-imagp8m8yghyyzgz.jpeg' },
            { name: 'Wine', img: 'https://rukminim2.flixcart.com/image/832/832/xif0q/gown/y/f/v/na-s-short-gown-z-atkins-original-imagp8m8xghfgyvz.jpeg' }
        ];

    const [selectedColor, setSelectedColor] = useState(colors[0]?.name || 'Black');

    const productImages = product ? [
        product.image,
        ...(product.images || []),
        'https://rukminim2.flixcart.com/image/832/832/xif0q/earring/y/t/z/na-er-2023-455-p4-shining-diva-fashion-original-imagrvv4hfyhywhm.jpeg'
    ].filter(Boolean) : [];

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
            // Default select first size if available
            if (found.sizes && found.sizes.length > 0) {
                setSelectedSize(found.sizes[0]);
            }

            // Find similar products
            const similar = products.filter(p => p.category === found.category && p.id !== pid);
            setSimilarProducts(similar);
            // Find high rated products in Fashion/Jewelry
            const highRated = products.filter(p => p.rating >= 4.0 && p.id !== pid).slice(0, 6);
            setHighRatedProducts(highRated);
        }
    }, [id]);

    if (!product) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="bg-[#f1f3f6] dark:bg-zinc-950 min-h-screen pb-10">
            {/* Header / Nav for Desktop */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-20 z-40 px-4 py-3">
                <div className="mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors group"
                    >
                        <span className="material-icons text-gray-600 dark:text-gray-400 group-hover:text-blue-600">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Home</span>
                        <span className="material-icons text-[16px] text-gray-300">chevron_right</span>
                        <span className="text-gray-400">{product.category}</span>
                        <span className="material-icons text-[16px] text-gray-300">chevron_right</span>
                        <span className="font-bold text-gray-700 dark:text-gray-200 line-clamp-1">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="w-full md:py-4 px-4">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

                    {/* LEFT COLUMN: Gallery (Sticky on Desktop) */}
                    <div className="lg:w-[45%] xl:w-[40%] shrink-0">
                        <div className="lg:sticky lg:top-[160px] space-y-4">
                            <div className="relative w-full aspect-square md:aspect-[4/5] bg-white dark:bg-zinc-900 md:rounded-xl shadow-sm overflow-hidden group border border-gray-100 dark:border-zinc-800">
                                {/* Mobile Floating Back (Hide on md+) */}
                                <button
                                    onClick={() => navigate(-1)}
                                    className="md:hidden absolute top-4 left-4 z-50 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800"
                                >
                                    <span className="material-icons">arrow_back</span>
                                </button>

                                <div
                                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full w-full"
                                    onScroll={(e) => {
                                        const width = e.target.offsetWidth;
                                        const index = Math.round(e.target.scrollLeft / width);
                                        setCurrentImageIndex(index);
                                    }}
                                >
                                    {productImages.map((img, idx) => (
                                        <div key={idx} className="min-w-full h-full snap-center flex items-center justify-center p-4">
                                            <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                                        </div>
                                    ))}
                                </div>

                                {/* Actions Icons */}
                                <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                                    <button
                                        onClick={() => toggleWishlist(product)}
                                        className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-lg flex items-center justify-center border border-gray-100 dark:border-zinc-700 transition-transform active:scale-90"
                                    >
                                        <span className={`material-icons text-xl ${isInWishlist ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {isInWishlist ? 'favorite' : 'favorite_border'}
                                        </span>
                                    </button>
                                    <button className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-lg flex items-center justify-center border border-gray-100 dark:border-zinc-700">
                                        <span className="material-icons-outlined text-gray-700 dark:text-gray-300 text-xl">share</span>
                                    </button>
                                </div>

                                {/* Dots */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                                    {productImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Desktop Actions (Hidden on mobile) */}
                            <div className="hidden lg:flex gap-3 px-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={currentStock === 0}
                                    className={`flex-1 font-bold py-4 rounded text-base uppercase tracking-wider transition-all shadow-sm ${currentStock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-900 active:scale-95'}`}
                                >
                                    Add to cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={currentStock === 0}
                                    className={`flex-1 font-bold py-4 rounded text-base uppercase tracking-wider shadow-md transition-all ${currentStock === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#fb641b] text-white hover:bg-[#e65c17] active:scale-95'}`}
                                >
                                    Buy now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Details */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-zinc-900 md:rounded-xl md:shadow-sm md:border md:border-gray-100 dark:md:border-zinc-800 md:p-6 overflow-hidden">
                            <div className="p-4 md:p-0 space-y-4">
                                {/* Brand & Rating */}
                                <div className="flex items-center justify-between">
                                    {product.brand && (
                                        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">{product.brand}</span>
                                    )}
                                    <div className="flex items-center gap-1 bg-green-700 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                                        {product.rating} <span className="material-icons text-[12px]">star</span>
                                    </div>
                                </div>

                                <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {product.name}
                                </h1>

                                <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    <p className={`${showFullDescription ? '' : 'line-clamp-2 md:line-clamp-none'}`}>
                                        {product.description || "This premium product is crafted with high-quality materials to ensure durability and style. Perfect for daily wear or special occasions."}
                                    </p>
                                    <button
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="md:hidden text-blue-600 font-bold text-xs mt-1 hover:underline"
                                    >
                                        {showFullDescription ? 'Show less' : '...more'}
                                    </button>
                                </div>

                                {/* Price Section */}
                                <div className="flex items-baseline gap-3 py-2 border-b border-gray-50 dark:border-zinc-800">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                                    {product.originalPrice > product.price && (
                                        <>
                                            <span className="text-lg text-gray-400 line-through font-medium">₹{product.originalPrice.toLocaleString()}</span>
                                            <span className="text-lg text-green-600 font-black">
                                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Color Selection */}
                                <div className="mt-6">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Color: <span className="text-gray-900 dark:text-white normal-case pl-2">{selectedColor}</span></h3>
                                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all p-0.5 ${selectedColor === color.name ? 'border-blue-600' : 'border-transparent bg-gray-50 dark:bg-zinc-800'}`}
                                            >
                                                <img src={color.img} alt={color.name} className="w-full h-full object-cover rounded-md" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Variant Selection */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-none">Select {variantLabel}</h3>
                                        <button className="text-xs font-bold text-blue-600 hover:underline">View Chart</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {variantOptions.map((opt) => (
                                            <button
                                                key={opt.label}
                                                onClick={() => opt.available && setSelectedSize(opt.label)}
                                                className={`min-w-[60px] h-11 px-4 rounded-lg flex flex-col items-center justify-center text-sm font-black border-2 transition-all relative ${!opt.available ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : selectedSize === opt.label ? 'border-blue-600 text-blue-600 bg-blue-50/30' : 'border-gray-200 text-gray-700 dark:text-gray-300 hover:border-blue-200'}`}
                                            >
                                                {opt.label}
                                                {!opt.available && <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-200 rotate-12"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Availability Status */}
                                <div className="mt-4 py-2">
                                    {currentStock <= 5 && currentStock > 0 && <p className="text-red-600 text-sm font-bold">Hurry, only {currentStock} left!</p>}
                                    {currentStock === 0 && (
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 font-bold text-sm">
                                            Unfortunately, this combination is currently out of stock.
                                        </div>
                                    )}
                                </div>

                                {/* Offers */}
                                <div className="mt-8 space-y-4">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-none">Exclusive Offers</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <span className="material-icons text-blue-600">local_offer</span>
                                                <div>
                                                    <p className="font-bold text-sm">Bank of Baroda Offer</p>
                                                    <p className="text-xs text-gray-500 mt-1">10% Instant Discount on BOB Cards</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-4 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <span className="material-icons text-green-600">event_available</span>
                                                <div>
                                                    <p className="font-bold text-sm">No Cost EMI</p>
                                                    <p className="text-xs text-gray-500 mt-1">Starting from ₹1,200/month</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Highlights Section */}
                                <div className="mt-8">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Product Highlights</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-2xl">
                                        {(product.highlights || [{ key: 'Material', value: 'Premium' }, { key: 'Style', value: 'Modern' }]).map((h, i) => (
                                            <div key={i}>
                                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">{h.key}</p>
                                                <p className="text-sm font-black text-gray-800 dark:text-gray-200">{h.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Tabs */}
                                <div className="mt-8">
                                    <div className="flex border-b border-gray-100 dark:border-zinc-800 mb-6">
                                        {['Description', 'Specifications', 'Manufacturer'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setSelectedDetailTab(tab)}
                                                className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${selectedDetailTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed min-h-[100px]">
                                        {selectedDetailTab === 'Description' && <p>{product.longDescription || "This exquisite product features premium craftsmanship and timeless design."}</p>}
                                        {selectedDetailTab === 'Specifications' && (
                                            <div className="space-y-3">
                                                <div className="flex border-b dark:border-zinc-800 pb-2"><span className="w-1/3 text-gray-400">Model</span><span className="font-bold text-gray-800 dark:text-white">{product.name}</span></div>
                                                <div className="flex border-b dark:border-zinc-800 pb-2"><span className="w-1/3 text-gray-400">Category</span><span className="font-bold text-gray-800 dark:text-white">{product.category}</span></div>
                                                <div className="flex border-b dark:border-zinc-800 pb-2"><span className="w-1/3 text-gray-400">Type</span><span className="font-bold text-gray-800 dark:text-white">Premium</span></div>
                                            </div>
                                        )}
                                        {selectedDetailTab === 'Manufacturer' && (
                                            <div className="space-y-1">
                                                <p className="font-bold text-gray-800 dark:text-white">IndianKart Private Limited</p>
                                                <p>Marketed by: RetailNet</p>
                                                <p>Origin: India</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* FULL WIDTH SECTIONS WITH BACKGROUND */}
            <div className="mt-8 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border-y border-gray-100 dark:border-zinc-800 w-full">
                    <div className="px-4 py-6 md:py-10">
                        <ProductSection
                            title="Similar Products"
                            products={similarProducts}
                            containerClass="p-0 border-none shadow-none rounded-none"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border-y border-gray-100 dark:border-zinc-800 w-full">
                    <div className="px-4 py-6 md:py-10">
                        <ProductSection
                            title="Recently Viewed"
                            products={products.slice(0, 6)}
                            containerClass="p-0 border-none shadow-none rounded-none"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Actions - MOBILE ONLY */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 p-2 flex gap-2 z-[100] shadow-2xl">
                <button
                    onClick={handleAddToCart}
                    disabled={currentStock === 0}
                    className={`flex-1 font-bold py-3.5 rounded-xl text-sm ${currentStock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-900'}`}
                >
                    Add to cart
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={currentStock === 0}
                    className={`flex-1 font-bold py-3.5 rounded-xl text-sm ${currentStock === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#ffc200] text-black shadow-lg shadow-yellow-500/20'}`}
                >
                    Buy now
                </button>
            </div>

            {/* Toast */}
            {showToast && (
                <div className="fixed bottom-24 left-4 right-4 bg-gray-900 text-white p-4 rounded-xl flex items-center justify-between z-[200] shadow-2xl animate-in slide-in-from-bottom duration-300">
                    <span className="text-sm font-bold">Added to cart!</span>
                    <button onClick={() => navigate('/cart')} className="text-blue-400 font-bold uppercase text-xs">View Cart</button>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
