import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mockData';
import ProductCard from '../components/product/ProductCard';
import { MdArrowBack, MdFilterList, MdSort } from 'react-icons/md';

const ProductListingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const title = searchParams.get('title'); // Support Custom Title via Query Param
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        let results = products;

        // Filter by Category
        if (category) {
            results = results.filter(p =>
                p.category?.toLowerCase() === category.toLowerCase() ||
                p.tags?.some(t => t.toLowerCase() === category.toLowerCase())
            );
        }

        // Filter by Subcategory/Tag
        if (subcategory) {
            results = results.filter(p =>
                p.subcategory?.toLowerCase() === subcategory.toLowerCase() ||
                p.tags?.some(t => t.toLowerCase() === subcategory.toLowerCase()) ||
                p.name?.toLowerCase().includes(subcategory.toLowerCase())
            );
        }

        setFilteredProducts(results);
    }, [category, subcategory]);

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-2">
            {/* Header / Back Navigation */}
            <div className="bg-white sticky top-0 z-10 shadow-sm px-3 py-3 flex items-center gap-3 mb-2">
                <MdArrowBack onClick={() => navigate(-1)} className="text-2xl text-gray-700 cursor-pointer" />
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold text-gray-800 capitalize leading-none">
                        {title || subcategory || category || 'Products'}
                    </h1>
                    <span className="text-xs text-gray-500">{filteredProducts.length} items</span>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20">
                        <p className="text-gray-500">No products found for this category.</p>
                    </div>
                )}
            </div>

            {/* Bottom Filter Bar (Static for now, as UI shouldn't change much but gives the look) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 flex items-center justify-between md:hidden z-20">
                <div className="flex items-center gap-2 w-1/2 justify-center border-r border-gray-200">
                    <MdSort className="text-lg text-gray-700" />
                    <span className="text-sm font-semibold text-gray-800">Sort</span>
                </div>
                <div className="flex items-center gap-2 w-1/2 justify-center">
                    <MdFilterList className="text-lg text-gray-700" />
                    <span className="text-sm font-semibold text-gray-800">Filter</span>
                </div>
            </div>
        </div>
    );
};

export default ProductListingPage;
