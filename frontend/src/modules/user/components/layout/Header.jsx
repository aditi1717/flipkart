import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useCategories } from '../../../../hooks/useData';
import API from '../../../../services/api';
import { IoSearch } from 'react-icons/io5';
import {
    MdLocationPin,
    MdStars,
    MdOutlineQrCodeScanner,
    MdHome,
    MdPlayCircleOutline,
    MdLocalOffer,
    MdPersonOutline,
    MdShoppingCart,
    MdExpandMore,
    MdGridView,
    MdCheckroom,
    MdSmartphone,
    MdFace,
    MdLaptop,
    MdShoppingBasket,
    MdOutlinePhotoCamera,

    MdKeyboardArrowRight,
    MdArrowBack,
    MdStore,
    MdMoreVert,
    MdKitchen,
    MdFlight,
    MdSportsEsports,
    MdCancel
} from 'react-icons/md';
import logo from '../../../../assets/indiankart-logo.png';

const Header = () => {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const navigate = useNavigate();
    const location = useLocation();
    const { categories, loading: categoriesLoading } = useCategories();
    
    // Mega menu state
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
    const [subcategoryProducts, setSubcategoryProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ products: [], categories: [], subCategories: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    // Fetch search results as user types (debounced)
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery.trim() || searchQuery.length < 2) {
                setSearchResults({ products: [], categories: [], subCategories: [] });
                setShowSearchDropdown(false);
                return;
            }

            setIsSearching(true);
            try {
                const { data } = await API.get(`/search?q=${searchQuery}`);
                setSearchResults(data);
                setShowSearchDropdown(true);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(fetchSearchResults, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Close search dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.search-container')) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Icon Mapping for dynamic data
    const iconMap = {
        // Categories
        'grid_view': MdGridView,
        'checkroom': MdCheckroom,
        'smartphone': MdSmartphone,
        'face': MdFace,
        'laptop': MdLaptop,
        'home': MdHome,
        'shopping_basket': MdShoppingBasket,
        'kitchen': MdKitchen,
        'flight': MdFlight,
        'sports_esports': MdSportsEsports,
        // Nav Items
        'play_circle_outline': MdPlayCircleOutline,
        'local_offer': MdLocalOffer,
        'person_outline': MdPersonOutline,
        'shopping_cart': MdShoppingCart,
    };

    // Fetch products when hovering on a subcategory
    useEffect(() => {
        const fetchProducts = async () => {
            if (!hoveredSubcategory || !hoveredCategory) {
                setSubcategoryProducts([]);
                return;
            }
            
            setLoadingProducts(true);
            try {
                const { data } = await API.get(`/products?category=${hoveredCategory}&subcategory=${hoveredSubcategory}`);
                setSubcategoryProducts(data.slice(0, 6)); // Limit to 6 products
            } catch (error) {
                console.error('Error fetching products:', error);
                setSubcategoryProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [hoveredSubcategory, hoveredCategory]);

    // Helper to check active state
    const isActiveCategory = (catName) => {
        if (catName === "For You" && location.pathname === "/") return true;
        return location.pathname.includes(`/category/${catName}`);
    };

    const navItems = [
        { name: 'Home', icon: 'home', path: '/' },
        { name: 'Play', icon: 'play_circle_outline', path: '/play' },
        { name: 'Categories', icon: 'grid_view', path: '/categories' },
        { name: 'Account', icon: 'person_outline', path: '/account' },
        { name: 'Cart', icon: 'shopping_cart', path: '/cart', badge: totalItems },
    ];

    const isPDP = location.pathname.includes('/product/');
    const isCategory = location.pathname.includes('/category/');
    const isSpecialPage = isPDP || isCategory;

    return (
        <header className={`bg-gradient-to-b from-white to-blue-100 px-3 fixed top-0 w-full left-0 right-0 z-50 shadow-sm border-b border-blue-100 md:border-gray-100 ${isSpecialPage ? 'py-2' : 'py-0.5 md:py-0'}`}>
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center md:gap-8">

                {/* Mobile Top Row: Logo (Left) + Seller Button (Right) */}
                <div className="flex items-center justify-between mb-0 md:mb-0 w-full md:w-auto">
                    {/* Mobile Logo */}
                    {!isSpecialPage && (
                        <div
                            className="flex items-center md:hidden -my-4 cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <img src={logo} alt="IndianKart" className="h-24 object-contain" />
                        </div>
                    )}

                    {/* Desktop Logo */}
                    <div
                        className="hidden md:flex flex-col cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <img src={logo} alt="IndianKart" className="h-[65px] lg:h-[100px] object-contain" />
                    </div>
                </div>

                {/* Mobile Address - Moved Above Search */}
                {!isSpecialPage && (
                    <div className="flex md:hidden w-full mb-2 items-center gap-1 bg-blue-50/50 p-1.5 rounded-lg border border-blue-100">
                        <MdLocationPin className="text-sm text-blue-600 shrink-0" />
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                            <span className="text-gray-900 text-xs font-bold whitespace-nowrap">Delivering to 452001</span>
                            <span className="text-gray-500 text-[10px] font-medium truncate">- Update location</span>
                        </div>
                        <MdKeyboardArrowRight className="text-sm text-gray-400 shrink-0" />
                    </div>
                )}

                {/* Search Bar Row */}
                <div className="flex items-center gap-3 flex-1 mt-0 md:mt-0 relative search-container">
                    <div className="flex-1 bg-white rounded-lg flex items-center px-3 md:px-4 shadow-sm md:shadow-none overflow-hidden h-10 md:h-11 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                        <IoSearch className={`text-gray-400 md:text-gray-500 text-[18px] md:text-[20px] mr-2 md:mr-3 ${isSearching ? 'animate-pulse' : ''}`} />
                        <input
                            className="bg-transparent border-none focus:ring-0 text-[14px] md:text-[15px] w-full p-0 outline-none placeholder-gray-400 md:placeholder-gray-500 text-black md:text-gray-800 h-full flex items-center font-normal"
                            placeholder="Search for Products, Brands and More"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                        />
                        {!isSpecialPage && !searchQuery && (
                            <div className="flex items-center gap-3 pl-2 md:hidden">
                                <MdOutlinePhotoCamera className="text-gray-400 text-[22px]" />
                            </div>
                        )}
                        {searchQuery && (
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults({ products: [], categories: [], subCategories: [] });
                                    setShowSearchDropdown(false);
                                }}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <MdCancel className="text-gray-400" size={18} />
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                            {/* Categories & Subcategories Section */}
                            {(searchResults.categories?.length > 0 || searchResults.subCategories?.length > 0) && (
                                <div className="p-2 border-b border-gray-50">
                                    <div className="flex flex-wrap gap-2">
                                        {searchResults.categories?.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    navigate(`/category/${cat.name}`);
                                                    setShowSearchDropdown(false);
                                                    setSearchQuery('');
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                <MdGridView size={14} />
                                                {cat.name}
                                            </button>
                                        ))}
                                        {searchResults.subCategories?.map(sub => (
                                            <button
                                                key={sub._id}
                                                onClick={() => {
                                                    navigate(`/category/${sub.category?.name}/${sub.name}`);
                                                    setShowSearchDropdown(false);
                                                    setSearchQuery('');
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-600 hover:text-white transition-all"
                                            >
                                                <MdKeyboardArrowRight size={14} />
                                                {sub.name} in <span className="opacity-70">{sub.category?.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Products Section */}
                            <div className="p-2">
                                <h3 className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Products</h3>
                                {searchResults.products?.length > 0 ? (
                                    <div className="space-y-1">
                                        {searchResults.products.map(product => (
                                            <div
                                                key={product.id || product._id}
                                                onClick={() => {
                                                    navigate(`/product/${product.id || product._id}`);
                                                    setShowSearchDropdown(false);
                                                    setSearchQuery('');
                                                }}
                                                className="flex items-center gap-4 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group"
                                            >
                                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{product.name}</h4>
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
                                                        {product.brand} • <span className="text-blue-600 font-bold">{product.category}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-gray-900">₹{product.price?.toLocaleString()}</div>
                                                    {product.discount > 0 && (
                                                        <div className="text-[9px] font-bold text-green-600 bg-green-50 px-1 rounded inline-block">{product.discount}% OFF</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-sm text-gray-400 font-medium italic">No products found matching "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cart Icon (Only Visible on Mobile Special Pages) */}
                    {isSpecialPage && (
                        <div
                            onClick={() => navigate('/cart')}
                            className="md:hidden flex items-center justify-center h-10 w-10 flex-shrink-0 relative pointer-events-auto cursor-pointer"
                        >
                            <MdShoppingCart className="text-gray-700 text-[24px]" />
                            {totalItems > 0 && (
                                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                    {totalItems}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6 ml-auto">
                    {/* Account */}
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors group" onClick={() => navigate('/account')}>
                        <MdPersonOutline className="text-[24px] text-gray-700" />
                        <span className="text-gray-800 font-medium text-[15px]">Account</span>
                        <MdExpandMore className="text-gray-700 transition-transform group-hover:rotate-180" />
                    </div>

                    {/* Cart */}
                    <div onClick={() => navigate('/cart')} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors relative">
                        <div className="relative">
                            <MdShoppingCart className="text-[24px] text-gray-700" />
                            {totalItems > 0 && <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">{totalItems}</div>}
                        </div>
                        <span className="text-gray-800 font-medium text-[15px]">Cart</span>
                    </div>

                    {/* More */}
                    <div className="p-2 cursor-pointer hover:bg-gray-50 rounded-full">
                        <MdMoreVert className="text-[24px] text-gray-700" />
                    </div>
                </div>
            </div>

            {/* Category Navigation - Hidden on PDP/List */}
            {!isSpecialPage && !categoriesLoading && (
                <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar gap-4 py-2 md:py-0 px-2 md:justify-between mt-0 md:-mt-2 border-t border-gray-100 pb-2 md:pb-1">
                    {categories.map((cat) => {
                        const active = isActiveCategory(cat.name);
                        const IconComponent = iconMap[cat.icon] || MdGridView;
                        return (
                            <div
                                key={cat.id}
                                onClick={() => cat.name === "For You" ? navigate('/') : navigate(`/category/${cat.name}`)}
                                className={`flex flex-col items-center gap-1 min-w-[60px] cursor-pointer group relative ${cat.name === 'For You' ? 'md:hidden' : ''}`}
                            >
                                <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white scale-105 shadow-md' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                    <IconComponent className="text-[20px] md:text-2xl" />
                                </div>
                                <span className={`text-[10px] md:text-sm font-bold transition-colors ${active ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}>
                                    {cat.name}
                                </span>

                                {/* Enhanced Mega Menu with Products */}
                                {(cat.children?.length > 0 || cat.subCategories?.length > 0) && (
                                    <div 
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 hidden md:group-hover:block z-50 animate-in fade-in slide-in-from-top-2"
                                        onMouseEnter={() => setHoveredCategory(cat.name)}
                                        onMouseLeave={() => {
                                            setHoveredCategory(null);
                                            setHoveredSubcategory(null);
                                        }}
                                    >
                                        {/* Triangle Pointer */}
                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-gray-100"></div>
                                        
                                        <div className="flex relative bg-white rounded-xl overflow-hidden">
                                            {/* Subcategories Column */}
                                            <div className="w-56 py-2 border-r border-gray-100">
                                                {(cat.children || cat.subCategories).map((sub) => (
                                                    <div 
                                                        key={sub.id || sub._id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/category/${cat.name}/${sub.name}`);
                                                        }}
                                                        onMouseEnter={() => setHoveredSubcategory(sub.name)}
                                                        className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center justify-between group/sub ${
                                                            hoveredSubcategory === sub.name 
                                                                ? 'bg-blue-50 text-blue-600' 
                                                                : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <span>{sub.name}</span>
                                                        <MdKeyboardArrowRight className={`text-lg transition-transform ${hoveredSubcategory === sub.name ? 'translate-x-1' : ''}`} />
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Products Panel */}
                                            {hoveredSubcategory && hoveredCategory === cat.name && (
                                                <div className="w-[500px] p-4 bg-gray-50/50">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                                                            {hoveredSubcategory}
                                                        </h3>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/category/${cat.name}/${hoveredSubcategory}`);
                                                            }}
                                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide"
                                                        >
                                                            View All →
                                                        </button>
                                                    </div>
                                                    
                                                    {loadingProducts ? (
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                                <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
                                                                    <div className="bg-gray-200 h-28 rounded-lg mb-2"></div>
                                                                    <div className="bg-gray-200 h-3 rounded mb-1"></div>
                                                                    <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : subcategoryProducts.length > 0 ? (
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {subcategoryProducts.map((product) => (
                                                                <div
                                                                    key={product.id || product._id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate(`/product/${product.id || product._id}`);
                                                                    }}
                                                                    className="bg-white rounded-lg p-2 hover:shadow-lg transition-all cursor-pointer group/product border border-transparent hover:border-blue-200"
                                                                >
                                                                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                                                                        <img 
                                                                            src={product.images?.[0]?.url || product.image} 
                                                                            alt={product.name}
                                                                            className="w-full h-full object-contain group-hover/product:scale-105 transition-transform"
                                                                        />
                                                                    </div>
                                                                    <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1 group-hover/product:text-blue-600 transition-colors">
                                                                        {product.name}
                                                                    </h4>
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-sm font-black text-gray-900">
                                                                            ₹{product.price?.toLocaleString()}
                                                                        </span>
                                                                        {product.originalPrice && product.originalPrice > product.price && (
                                                                            <span className="text-xs text-gray-400 line-through">
                                                                                ₹{product.originalPrice?.toLocaleString()}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {product.discount && (
                                                                        <span className="inline-block text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded mt-1">
                                                                            {product.discount}% OFF
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8 text-sm text-gray-500">
                                                            <MdShoppingBasket className="mx-auto text-4xl text-gray-300 mb-2" />
                                                            <p>No products available</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </header>
    );
};

export default Header;
