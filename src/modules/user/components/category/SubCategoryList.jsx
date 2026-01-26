import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SubCategoryList = ({ subCategories }) => {
    const location = useLocation();
    if (!subCategories || subCategories.length === 0) return null;

    return (
        <>
            {/* MOBILE VIEW: Identical to original 2-row grid */}
            <div className="lg:hidden bg-white dark:bg-gray-900 py-4 mb-2">
                <div className="grid grid-rows-2 grid-flow-col auto-cols-min gap-x-4 gap-y-3 overflow-x-auto px-4 no-scrollbar">
                    {subCategories.map((sub, index) => {
                        const currentPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
                        const targetPath = `${currentPath}/${encodeURIComponent(sub.name)}`;

                        return (
                            <Link key={index} to={targetPath} className="flex flex-col items-center cursor-pointer hover:opacity-80 w-[60px]">
                                <div className="w-[60px] h-[60px] bg-[#ffede2] rounded-[18px] border-b-[3px] border-orange-200 flex items-center justify-center overflow-hidden mb-1">
                                    <img
                                        src={sub.image}
                                        alt={sub.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=150&auto=format&fit=crop';
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] font-semibold text-center text-black dark:text-gray-300 leading-tight w-[64px] line-clamp-2 tracking-tight">
                                    {sub.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* DESKTOP VIEW: New responsive layout */}
            <div className="hidden lg:block bg-white dark:bg-zinc-900 py-4">
                <div className="flex flex-wrap justify-start gap-8 px-4 no-scrollbar">
                    {subCategories.map((sub, index) => {
                        const currentPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
                        const targetPath = `${currentPath}/${encodeURIComponent(sub.name)}`;

                        return (
                            <Link key={index} to={targetPath} className="flex flex-col items-center cursor-pointer group shrink-0">
                                <div className="w-24 h-24 bg-[#f8f9fb] dark:bg-zinc-800 rounded-full border border-gray-100 dark:border-zinc-700 flex items-center justify-center overflow-hidden mb-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:border-blue-400">
                                    <img
                                        src={sub.image}
                                        alt={sub.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=150&auto=format&fit=crop';
                                        }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-center text-gray-700 dark:text-gray-300 leading-tight w-28 line-clamp-1 tracking-tight group-hover:text-blue-600 transition-colors">
                                    {sub.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default SubCategoryList;
