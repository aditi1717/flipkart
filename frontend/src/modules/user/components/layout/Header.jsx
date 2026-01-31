import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useCategories } from '../../../../hooks/useData';
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
    MdSportsEsports
} from 'react-icons/md';
import logo from '../../../../assets/indiankart-logo.png';

const Header = () => {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const navigate = useNavigate();
    const location = useLocation();
    const { categories, loading: categoriesLoading } = useCategories();

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
                <div className="flex items-center gap-3 flex-1 mt-0 md:mt-0">
                    <div className="flex-1 bg-white rounded-lg flex items-center px-3 md:px-4 shadow-sm md:shadow-none overflow-hidden h-10 md:h-11 border border-gray-200">
                        <IoSearch className="text-gray-400 md:text-gray-500 text-[18px] md:text-[20px] mr-2 md:mr-3" />
                        <input
                            className="bg-transparent border-none focus:ring-0 text-[14px] md:text-[15px] w-full p-0 outline-none placeholder-gray-400 md:placeholder-gray-500 text-black md:text-gray-800 h-full flex items-center font-normal"
                            placeholder="Search for Products, Brands and More"
                            type="text"
                        />
                        {!isSpecialPage && (
                            <div className="flex items-center gap-3 pl-2 md:hidden">
                                <MdOutlinePhotoCamera className="text-gray-400 text-[22px]" />
                            </div>
                        )}
                    </div>

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

                                {/* Hover Subcategories Dropdown */}
                                {(cat.children?.length > 0 || cat.subCategories?.length > 0) && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 hidden md:group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
                                        {/* Little Triangle Pointer */}
                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-gray-100"></div>
                                        
                                        <div className="py-2 relative bg-white rounded-xl">
                                            {(cat.children || cat.subCategories).map((sub) => (
                                                <div 
                                                    key={sub.id || sub._id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/category/${cat.name}/${sub.name}`);
                                                    }}
                                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors text-center whitespace-normal"
                                                >
                                                    {sub.name}
                                                </div>
                                            ))}
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
