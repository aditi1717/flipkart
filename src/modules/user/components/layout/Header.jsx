import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { categories } from '../../data/mockData';
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
    MdArrowBack
} from 'react-icons/md';
import logo from '../../../../assets/indiankart-logo.png';

const Header = () => {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const navigate = useNavigate();
    const location = useLocation();

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
        <header className={`bg-gradient-to-b from-white to-blue-100 px-3 fixed top-0 w-full left-0 right-0 z-50 shadow-sm border-b border-blue-100 ${isSpecialPage ? 'py-2' : 'py-0.5'}`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:gap-8">

                {/* Mobile Top Row: Logo (Left) + Seller Button (Right) */}
                <div className="flex items-center justify-between mb-0 md:mb-0 w-full md:w-auto">
                    {/* Mobile Logo */}
                    {!isSpecialPage && (
                        <div className="flex items-center md:hidden -my-4">
                            <img src={logo} alt="IndianKart" className="h-24 object-contain" />
                        </div>
                    )}

                    {/* Beome a Seller Button (Right) */}
                    {!isSpecialPage && (
                        <button
                            onClick={() => navigate('/seller-registration')}
                            className="md:hidden flex items-center gap-1 bg-yellow-500 text-white px-3 py-1.5 rounded-md text-[10px] font-bold shadow-sm whitespace-nowrap"
                        >
                            <MdStars className="text-sm" />
                            Become a Seller
                        </button>
                    )}

                    {/* Desktop Logo */}
                    <div className="hidden md:flex flex-col">
                        <img src={logo} alt="IndianKart" className="h-14 object-contain rounded-md" />
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
                    <div className="flex-1 bg-white rounded-lg flex items-center px-3 shadow-sm overflow-hidden h-10 border border-gray-200">
                        <IoSearch className="text-gray-400 text-[18px] mr-2" />
                        <input
                            className="bg-transparent border-none focus:ring-0 text-[14px] w-full p-0 outline-none placeholder-gray-400 text-black h-full flex items-center font-normal"
                            placeholder="Search for products"
                            type="text"
                        />
                        {!isSpecialPage && (
                            <div className="flex items-center gap-3 pl-2">
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
                <div className="hidden md:flex items-center gap-8 ml-4">
                    <button className="bg-blue-600 text-white px-8 py-1 rounded-sm font-bold text-sm hover:bg-blue-700 transition-colors">
                        Login
                    </button>
                    {navItems.filter(item => item.name !== 'Home').map((item) => {
                        const IconComponent = iconMap[item.icon] || MdHome;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 text-gray-700 font-semibold text-sm hover:text-blue-600 transition-colors`
                                }
                            >
                                <div className="relative">
                                    <IconComponent className="text-[20px] md:hidden lg:block" />
                                    {item.badge > 0 && (
                                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {item.badge}
                                        </div>
                                    )}
                                </div>
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-blue-600">
                        <span className="font-semibold text-sm">More</span>
                        <MdExpandMore className="text-sm transition-transform group-hover:rotate-180" />
                    </div>
                </div>
            </div>

            {/* Category Navigation - Hidden on PDP/List */}
            {!isSpecialPage && (
                <div className="flex overflow-x-auto no-scrollbar gap-4 py-2 px-2 md:justify-center md:gap-10 mt-0 border-t border-gray-100 pb-2">
                    {categories.map((cat) => {
                        const active = isActiveCategory(cat.name);
                        const IconComponent = iconMap[cat.icon] || MdGridView;
                        return (
                            <div
                                key={cat.id}
                                onClick={() => cat.name === "For You" ? navigate('/') : navigate(`/category/${cat.name}`)}
                                className={`flex flex-col items-center gap-1 min-w-[60px] cursor-pointer group relative`}
                            >
                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white scale-105 shadow-md' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                    <IconComponent className="text-[20px] md:text-2xl" />
                                </div>
                                <span className={`text-[10px] md:text-xs font-medium transition-colors ${active ? 'text-blue-600 font-bold' : 'text-gray-600 group-hover:text-blue-600'}`}>
                                    {cat.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </header>
    );
};

export default Header;
