import React from 'react';
import { useNavigate } from 'react-router-dom';

const DealGrid = ({
    title,
    items,
    bgColor = "bg-[#ffdcb4]",
    darkBgColor = "dark:bg-[#4d3420]",
    titleKey = "name",
    subtitleKey = "discount",
    imageKey = "image",
    showArrow = true,
    showStamp = false,
    stampText = "NEW DELHI INDIA",
    containerClass = "mt-4"
}) => {
    const navigate = useNavigate();

    const handleItemClick = (item) => {
        const params = new URLSearchParams();
        if (item.category) params.append('category', item.category);
        if (item.subcategory) params.append('subcategory', item.subcategory);
        else if (item.name) params.append('subcategory', item.name); // Fallback to name as subcat

        navigate(`/products?${params.toString()}`);
    };

    return (
        <section className={`${containerClass} px-4`}>
            <div className={`${bgColor} ${darkBgColor} rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden`}>

                {/* Optional Stamp Decoration */}
                {showStamp && (
                    <div className="absolute top-2 right-2 opacity-10 rotate-12 pointer-events-none select-none">
                        <span className="text-[10px] md:text-sm font-black uppercase border-2 border-current px-2 py-0.5 leading-none whitespace-nowrap">
                            {stampText}
                        </span>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-base md:text-xl font-bold dark:text-white">{title}</h3>
                    {showArrow && (
                        <button className="bg-black text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-800 transition-colors z-10">
                            <span className="material-icons text-white text-lg">arrow_forward</span>
                        </button>
                    )}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {items.map((item, idx) => (
                        <div
                            key={item.id || idx}
                            onClick={() => handleItemClick(item)}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm cursor-pointer group hover:shadow-md transition-all overflow-hidden"
                        >
                            <div className="aspect-square bg-[#f8f8f8] dark:bg-gray-900 mb-2 overflow-hidden flex items-center justify-center">
                                <img
                                    src={item[imageKey]}
                                    alt={item[titleKey]}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                                    }}
                                />
                            </div>
                            <div className="px-2 pb-2">
                                <p className="text-[11px] md:text-sm text-gray-600 dark:text-gray-400 font-medium truncate mb-0.5">
                                    {item[titleKey]}
                                </p>
                                <p className="text-xs md:text-base font-bold text-gray-900 dark:text-white">
                                    {item[subtitleKey]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DealGrid;
