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

        setSortedProducts(updated);
    }, [sortBy, filterRange, categoryProducts]);

    if (!categoryData) {
        return <div className="p-10 text-center">Category not found</div>;
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-20 pt-2">
            {/* Back Button Row */}
            <div className="flex items-center gap-2 px-3 mb-2 md:hidden">
                <MdArrowBack onClick={() => navigate(-1)} className="text-2xl text-gray-700 cursor-pointer" />
                <span className="text-base font-semibold capitalize text-gray-800">{categoryName}</span>
            </div>

            {/* 1. Main Banner */}
            <CategoryBanner
                image={categoryData.bannerImage}
                alt={categoryData.bannerAlt}
                banners={categoryData.banners}
            />

            {/* 2. Sub-Categories */}
            <SubCategoryList subCategories={categoryData.subCategories} />

            {/* 3. Deal Section (Grid) */}
            <CategoryDeals deals={categoryData.deals} />

            {/* 4. Scrollable Deals Section */}
            <CategoryScrollDeals deals={categoryData.scrollDeals} title="Blockbuster deals" />

            {/* 5. Promo Banners */}
            {categoryData.promoBanners && categoryData.promoBanners.length > 0 && (
                <div className="px-2 mb-2 space-y-2">
                    {categoryData.promoBanners.map((banner, index) => (
                        <div key={index} className="rounded-xl overflow-hidden shadow-sm">
                            <img
                                src={banner.image}
                                alt={banner.alt}
                                className="w-full h-32 object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* 6. Secondary Banner (Existing logic) */}
            {categoryData.secondaryBannerImage && (
                <div className="px-2 mt-2 mb-4">
                    <div className="rounded-xl overflow-hidden shadow-sm">
                        <img
                            src={categoryData.secondaryBannerImage}
                            alt="Special Offer"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            )}

            {/* 4. Product Grid */}
            <div className="px-2">
                <h2 className="text-lg font-bold mb-3 px-1 border-l-4 border-primary pl-2 dark:text-white">
                    Explore {categoryData.name}
                </h2>
                {/* Using grid-cols-2 to match standard category browsing, but using ProductCard for consistent styling */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {sortedProducts.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                {sortedProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl">
                        <span className="material-icons text-4xl mb-2 opacity-50">search_off</span>
                        <p>No products match your filters.</p>
                    </div>
                )}
            </div>

            {/* Sticky Sort/Filter Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 h-14 flex z-50">
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
            </div>

            {/* Sort Modal */}
            {showSortModal && (
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
                                { id: 'rating', label: 'Customer Ratings', icon: 'thumb_up' },
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
            )}

            {/* Filter Modal (Simplified for now) */}
            {showFilterModal && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilterModal(false)}></div>
                    <div className="relative w-full bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden h-[70vh] flex flex-col">
                        <div className="px-6 py-4 border-b dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 dark:text-white uppercase text-xs tracking-widest">Filters</h3>
                            <button onClick={() => setShowFilterModal(false)} className="material-icons text-gray-400">close</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
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

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">Customer Rating</h4>
                                <div className="flex gap-2">
                                    {[4, 3, 2, 1].map((star) => (
                                        <button
                                            key={star}
                                            className="px-3 py-2 rounded-lg border border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 active:bg-blue-50 active:border-blue-200"
                                        >
                                            {star} <span className="material-icons text-[12px] text-yellow-500">star</span> & above
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                            <button
                                onClick={() => setFilterRange([0, 100000])}
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
            )}
        </div>
    );
};

export default CategoryPage;
