import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { categories, products, resolveCategoryPath } from '../data/mockData';
import CategoryBanner from '../components/category/CategoryBanner';
import SubCategoryList from '../components/category/SubCategoryList';
import CategoryDeals from '../components/category/CategoryDeals';
import CategoryScrollDeals from '../components/category/CategoryScrollDeals';
import ProductCard from '../components/product/ProductCard';

const CategoryPage = () => {
    const navigate = useNavigate();
    const { categoryName, "*": subPath } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [showSortModal, setShowSortModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [sortBy, setSortBy] = useState('popularity'); // popularity, price-low, price-high, rating
    const [filterRange, setFilterRange] = useState([0, 100000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedRam, setSelectedRam] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const result = resolveCategoryPath(categoryName, subPath);

        if (result && result.data) {
            setCategoryData(result.data);
            setCategoryProducts(result.products);
            setSortedProducts(result.products);
        } else {
            setCategoryData(null);
        }
    }, [categoryName, subPath]);

    useEffect(() => {
        let updated = [...categoryProducts];

        // Apply Price Filter
        updated = updated.filter(p => p.price >= filterRange[0] && p.price <= filterRange[1]);

        // Apply Sorting
        if (sortBy === 'price-low') {
            updated.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            updated.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            updated.sort((a, b) => b.rating - a.rating);
        }


        // Apply Brand Filter
        if (selectedBrands.length > 0) {
            updated = updated.filter(p => p.brand && selectedBrands.includes(p.brand));
        }

        // Apply RAM Filter
        if (selectedRam.length > 0) {
            updated = updated.filter(p => p.ram && selectedRam.includes(p.ram));
        }

        setSortedProducts(updated);
    }, [sortBy, filterRange, selectedBrands, selectedRam, categoryProducts]);

    // Unique Brands and RAM options
    const availableBrands = [...new Set(categoryProducts.map(p => p.brand).filter(Boolean))];
    const availableRam = [...new Set(categoryProducts.map(p => p.ram).filter(Boolean))];

    const toggleBrand = (brand) => {
        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    };

    const toggleRam = (ram) => {
        setSelectedRam(prev => prev.includes(ram) ? prev.filter(r => r !== ram) : [...prev, ram]);
    };

    if (!categoryData) {
        return <div className="p-10 text-center">Category not found</div>;
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-20 md:pb-10 lg:bg-[#f1f3f6]">
            {/* Back Button Row (Mobile) */}
            <div className="flex items-center gap-2 px-3 mb-2 md:hidden">
                <MdArrowBack onClick={() => navigate(-1)} className="text-2xl text-gray-700 cursor-pointer" />
                <span className="text-base font-semibold capitalize text-gray-800 dark:text-white">{categoryData.name}</span>
            </div>

            <div className="max-w-[1440px] mx-auto md:px-4 md:py-4">
                {/* Desktop Heading & Back Arrow */}
                <div className="hidden md:flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white dark:bg-zinc-900 p-2 rounded-full shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow group"
                    >
                        <MdArrowBack className="text-xl text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 dark:text-white capitalize tracking-tight flex items-center gap-2">
                            {categoryData.name}
                            <span className="text-sm font-medium text-gray-400">({sortedProducts.length} items)</span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">

                    {/* LEFT SIDEBAR (Desktop Only) */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-4">
                        <div className="bg-white dark:bg-zinc-900 rounded shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden sticky top-20">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                                <h3 className="font-bold text-gray-800 dark:text-white uppercase text-xs tracking-wider">Filters</h3>
                            </div>

                            {/* Price Filter */}
                            <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Price</h4>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Under ₹500', range: [0, 500] },
                                        { label: '₹500 - ₹2000', range: [500, 2000] },
                                        { label: '₹2000 - ₹5000', range: [2000, 5000] },
                                        { label: 'Above ₹5000', range: [5000, 1000000] },
                                    ].map((r) => (
                                        <label key={r.label} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="priceFilter"
                                                checked={JSON.stringify(filterRange) === JSON.stringify(r.range)}
                                                onChange={() => setFilterRange(r.range)}
                                                className="w-4 h-4 accent-blue-600"
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
                                                {r.label}
                                            </span>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => setFilterRange([0, 1000000])}
                                        className="text-xs text-blue-600 font-bold hover:underline pt-2"
                                    >
                                        Clear Price Filter
                                    </button>
                                </div>
                            </div>

                            {/* Brand Filter */}
                            {availableBrands.length > 0 && (
                                <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Brand</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                        {availableBrands.map((brand) => (
                                            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBrands.includes(brand)}
                                                    onChange={() => toggleBrand(brand)}
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
                                                    {brand}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* RAM Filter */}
                            {availableRam.length > 0 && (
                                <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">RAM</h4>
                                    <div className="space-y-2">
                                        {availableRam.map((ram) => (
                                            <label key={ram} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRam.includes(ram)}
                                                    onChange={() => toggleRam(ram)}
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
                                                    {ram}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sort Filter - Restored for Web */}
                            <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sort By</h4>
                                <div className="space-y-3">
                                    {[
                                        { id: 'popularity', label: 'Popularity' },
                                        { id: 'price-low', label: 'Price -- Low to High' },
                                        { id: 'price-high', label: 'Price -- High to Low' },
                                        { id: 'newest', label: 'Newest First' },
                                    ].map((option) => (
                                        <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="sortBy"
                                                checked={sortBy === option.id}
                                                onChange={() => setSortBy(option.id)}
                                                className="w-4 h-4 accent-blue-600"
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 min-w-0 space-y-4">

                        {/* 1. Main Banner */}
                        {(categoryData.bannerImage || (categoryData.banners && categoryData.banners.length > 0)) && (
                            <div className="bg-white dark:bg-zinc-900 md:rounded md:shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-800">
                                <CategoryBanner
                                    image={categoryData.bannerImage}
                                    alt={categoryData.bannerAlt}
                                    banners={categoryData.banners}
                                />
                            </div>
                        )}

                        {/* 2. Sub-Categories (Horizontal list) */}
                        {categoryData.subCategories && categoryData.subCategories.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 md:rounded md:shadow-sm py-2 px-1 border border-gray-100 dark:border-zinc-800">
                                <SubCategoryList subCategories={categoryData.subCategories} />
                            </div>
                        )}



                        {/* 5. Promo Banners */}
                        {categoryData.promoBanners && categoryData.promoBanners.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {categoryData.promoBanners.map((banner, index) => (
                                    <div key={index} className="rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800">
                                        <img
                                            src={banner.image}
                                            alt={banner.alt}
                                            className="w-full h-40 object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 6. Product Section */}
                        <div className="bg-white dark:bg-zinc-900 md:rounded md:shadow-sm border border-gray-100 dark:border-zinc-800 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base md:text-xl font-bold dark:text-white uppercase tracking-tight">
                                    Explore {categoryData.name}
                                </h2>
                                <span className="text-xs text-gray-400 font-medium">({sortedProducts.length} Products)</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-3 md:gap-5">
                                {sortedProducts.map((product) => (
                                    <div key={product.id} className="transition-transform hover:scale-[1.02] duration-300">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            {sortedProducts.length === 0 && (
                                <div className="p-20 text-center text-gray-500 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                    <span className="material-icons text-6xl mb-4 opacity-50">search_off</span>
                                    <p className="text-lg font-bold">No products match your filters.</p>
                                    <button
                                        onClick={() => {
                                            setFilterRange([0, 1000000]);
                                            setSelectedBrands([]);
                                            setSelectedRam([]);
                                        }}
                                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-bold uppercase text-xs"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div >

            {/* Sticky Sort/Filter Bar (MOBILE ONLY) */}
            < div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 h-14 flex z-50" >
                <button
                    onClick={() => setShowSortModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 border-r border-gray-100 dark:border-zinc-800 group active:bg-gray-50 dark:active:bg-zinc-800"
                >
                    <span className="material-icons text-[18px] text-gray-500">swap_vert</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Sort</span>
                </button>
                <button
                    onClick={() => setShowFilterModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 active:bg-gray-50 dark:active:bg-zinc-800"
                >
                    <span className="material-icons text-[18px] text-gray-500">filter_list</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Filter</span>
                </button>
            </div >

            {/* Sort Modal (MOBILE ONLY) - Restored for Mobile Consistency */}
            {
                showSortModal && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSortModal(false)}></div>
                        <div className="relative w-full bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
                            <div className="px-6 py-4 border-b dark:border-zinc-800 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 dark:text-white uppercase text-xs tracking-widest">Sort By</h3>
                                <button onClick={() => setShowSortModal(false)} className="material-icons text-gray-400">close</button>
                            </div>
                            <div className="p-2">
                                {[
                                    { id: 'popularity', label: 'Popularity', icon: 'stars' },
                                    { id: 'price-low', label: 'Price -- Low to High', icon: 'trending_up' },
                                    { id: 'price-high', label: 'Price -- High to Low', icon: 'trending_down' },
                                    { id: 'newest', label: 'Newest First', icon: 'new_releases' },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => { setSortBy(option.id); setShowSortModal(false); }}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${sortBy === option.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 active:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons-outlined text-lg">{option.icon}</span>
                                            <span className="font-bold text-sm tracking-tight">{option.label}</span>
                                        </div>
                                        {sortBy === option.id && <span className="material-icons text-lg">check_circle</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }



            {/* Filter Modal (MOBILE ONLY) */}
            {
                showFilterModal && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilterModal(false)}></div>
                        <div className="relative w-full bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden h-[70vh] flex flex-col">
                            <div className="px-6 py-4 border-b dark:border-zinc-800 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 dark:text-white uppercase text-xs tracking-widest">Filters</h3>
                                <button onClick={() => setShowFilterModal(false)} className="material-icons text-gray-400">close</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                                {/* Brand Filter Mobile */}
                                {availableBrands.length > 0 && (
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">Brand</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {availableBrands.map((brand) => (
                                                <button
                                                    key={brand}
                                                    onClick={() => toggleBrand(brand)}
                                                    className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${selectedBrands.includes(brand)
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10 text-blue-600'
                                                        : 'border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    {brand}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* RAM Filter Mobile */}
                                {availableRam.length > 0 && (
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">RAM</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {availableRam.map((ram) => (
                                                <button
                                                    key={ram}
                                                    onClick={() => toggleRam(ram)}
                                                    className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${selectedRam.includes(ram)
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10 text-blue-600'
                                                        : 'border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    {ram}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6">Price Range</h4>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-lg border dark:border-zinc-700">
                                                <span className="text-[10px] text-gray-400 block uppercase font-bold">Min</span>
                                                <span className="font-black text-sm dark:text-white">₹{filterRange[0].toLocaleString()}</span>
                                            </div>
                                            <div className="w-8 h-[2px] bg-gray-200 dark:bg-zinc-800"></div>
                                            <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-lg border dark:border-zinc-700">
                                                <span className="text-[10px] text-gray-400 block uppercase font-bold">Max</span>
                                                <span className="font-black text-sm dark:text-white">₹{filterRange[1].toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: 'Under ₹500', range: [0, 500] },
                                                { label: '₹500 - ₹2000', range: [500, 2000] },
                                                { label: '₹2000 - ₹5000', range: [2000, 5000] },
                                                { label: 'Above ₹5000', range: [5000, 1000000] },
                                            ].map((r) => (
                                                <button
                                                    key={r.label}
                                                    onClick={() => setFilterRange(r.range)}
                                                    className={`px-3 py-2.5 rounded-lg border transition-all text-xs font-bold leading-tight ${JSON.stringify(filterRange) === JSON.stringify(r.range)
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10 text-blue-600'
                                                        : 'border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    {r.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>


                            </div>

                            <div className="p-4 border-t dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                                <button
                                    onClick={() => {
                                        setFilterRange([0, 100000]);
                                        setSelectedBrands([]);
                                        setSelectedRam([]);
                                    }}
                                    className="flex-1 py-4 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-gray-600"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="flex-[2] bg-[#fb641b] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#fb641b]/20 active:scale-95 transition-all"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default CategoryPage;
