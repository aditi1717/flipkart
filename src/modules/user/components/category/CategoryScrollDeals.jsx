import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryScrollDeals = ({ deals, title }) => {
    const navigate = useNavigate();
    if (!deals || deals.length === 0) return null;

    const handleDealClick = (deal) => {
        const params = new URLSearchParams();
        // Since deals in mockData might not have explicit category, we try to infer or pass it if available
        // Or if deals are generic, we might default to 'Top Deals' or similar if no category present
        if (deal.category) params.append('category', deal.category);

        // Some deals use 'name' as product name, some as category/deal name
        // We'll use name as subcategory/tag filter for now to find relevant products
        if (deal.name) params.append('subcategory', deal.name);

        navigate(`/products?${params.toString()}`);
    };

    return (
        <div className="bg-white dark:bg-gray-900 py-4 px-2 mb-2">
            {title && (
                <h3 className="text-lg font-bold mb-3 px-1 dark:text-white">{title}</h3>
            )}
            <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">
                {deals.map((deal, index) => (
                    <div
                        key={index}
                        onClick={() => handleDealClick(deal)}
                        className="flex-shrink-0 w-28 md:w-36 flex flex-col items-center cursor-pointer"
                    >
                        {/* Card Container with Image and Price Banner */}
                        <div className="w-full rounded-2xl border border-gray-200 overflow-hidden flex flex-col mb-1 relative bg-white">
                            {/* Image Area */}
                            <div className="h-28 md:h-36 bg-[#eff3f6] flex items-center justify-center">
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

export default CategoryScrollDeals;
