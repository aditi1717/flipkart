import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SubCategoryList = ({ subCategories }) => {
    const location = useLocation();
    if (!subCategories || subCategories.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-900 py-4 mb-2">
            <div className="grid grid-rows-2 grid-flow-col auto-cols-min gap-x-4 gap-y-3 overflow-x-auto px-4 no-scrollbar">
                {subCategories.map((sub, index) => {
                    const currentPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
                    const targetPath = `${currentPath}/${encodeURIComponent(sub.name)}`;

                    return (
                        <Link key={index} to={targetPath} className="flex flex-col items-center cursor-pointer hover:opacity-80 w-[60px]">
                            {/* Base Podium */}
                            <div className="w-[60px] h-[60px] md:w-20 md:h-20 bg-[#ffede2] rounded-[18px] border-b-[3px] border-orange-200 flex items-center justify-center overflow-hidden mb-1">
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
                            {/* Label */}
                            <span className="text-[10px] md:text-xs font-semibold text-center text-black leading-tight w-[64px] line-clamp-2 tracking-tight">
                                {sub.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default SubCategoryList;
