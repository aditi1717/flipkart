import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, footerText }) => {
    const navigate = useNavigate();

    // Calculate dynamic discount if not provided
    const discountPercent = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) + '% OFF' : null);

    // Default footer text if none provided
    const displayFooterText = footerText || `₹${Math.round(product.price * 0.95).toLocaleString()} with Bank offer`;

    return (
        <div
            className="flex flex-col h-full cursor-pointer group"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <div className="relative aspect-square mb-2 bg-[#f8f8f8] dark:bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-50 dark:border-gray-800 shadow-sm">
                <img
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={product.image}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    }}
                />

                {/* Rating Badge - Bottom Left */}
                {product.rating && (
                    <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-[10px] font-bold shadow-sm border border-black/5 leading-none">
                        {product.rating} <span className="material-icons text-green-700" style={{ fontSize: '10px' }}>star</span>
                    </div>
                )}

                {/* AD Badge - Top Right (Conditional or dynamic based on ID) */}
                {(product.id % 4 === 0) && (
                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                        AD
                    </div>
                )}
            </div>

            <div className="px-1 flex flex-col flex-1">
                {/* Brand / Title */}
                <h4 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 line-clamp-1 mb-0.5">
                    {product.brand || product.name.split(' ')[0]} {product.name}
                </h4>

                {/* Discount Percentage */}
                {discountPercent && (
                    <p className="text-[11px] font-bold text-green-700 dark:text-green-500 mb-0.5 uppercase">
                        {discountPercent}
                    </p>
                )}

                {/* Prices */}
                <div className="flex items-center gap-1.5 mb-0.5">
                    {product.originalPrice && (
                        <span className="text-[12px] text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-[14px] font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                </div>

                {/* Offer/Footer Text */}
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 line-clamp-1">
                    {displayFooterText}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
