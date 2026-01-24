import React from 'react';
import ProductCard from '../product/ProductCard';

const ProductSection = ({
    title,
    titleBadge,
    products,
    onViewAll,
    containerClass = "mt-6",
    isScrollable = true
}) => {
    if (!products || products.length === 0) return null;

    return (
        <section className={`${containerClass} px-4`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-[17px] font-bold dark:text-white">{title}</h3>
                    {titleBadge && (
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            {titleBadge}
                        </span>
                    )}
                </div>
                <button
                    onClick={onViewAll}
                    className="bg-gray-900 dark:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                    <span className="material-icons text-white text-lg">arrow_forward</span>
                </button>
            </div>

            {isScrollable ? (
                <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2 -mx-1 px-1">
                    {products.map((product) => (
                        <div key={product.id} className="min-w-[140px] w-[140px] flex-shrink-0">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default ProductSection;
