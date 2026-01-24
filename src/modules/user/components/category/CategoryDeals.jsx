import React from 'react';

const CategoryDeals = ({ deals }) => {
    if (!deals || deals.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-900 py-4 px-2 mb-2">
            <h3 className="text-lg font-bold mb-3 px-1 dark:text-white">Blockbuster deals</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {deals.map((deal, index) => (
                    <div key={index} className="flex flex-col items-center cursor-pointer">
                        {/* Card Container with Image and Price Banner */}
                        <div className="w-full rounded-2xl border border-gray-200 overflow-hidden flex flex-col mb-1 relative bg-white">
                            {/* Image Area */}
                            <div className="aspect-square bg-[#eff3f6] flex items-center justify-center">
                                <img
                                    src={deal.image}
                                    alt={deal.name}
                                    className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            {/* Orange Price Banner */}
                            <div className="bg-[#ff6000] text-white text-[11px] md:text-sm font-bold py-1 px-1 w-full text-center truncate relative z-10">
                                {deal.offer}
                            </div>
                        </div>
                        {/* Product Name (Outside) */}
                        <span className="text-[11px] md:text-sm text-center text-gray-800 dark:text-gray-300 font-medium leading-tight line-clamp-2 px-1">
                            {deal.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryDeals;
