import { useNavigate } from 'react-router-dom';
import DealGrid from '../components/home/DealGrid';
import ProductSection from '../components/home/ProductSection';
import HomeBanner from '../components/home/HomeBanner';
import { useProducts, useHomeSections, useBanners, useHomeLayout } from '../../../hooks/useData';

const Home = () => {
    const navigate = useNavigate();
    const { products, loading: productsLoading } = useProducts();
    const { sections, loading: sectionsLoading } = useHomeSections();
    const { banners, loading: bannersLoading } = useBanners();
    const { layout, loading: layoutLoading } = useHomeLayout();

    const isLoading = productsLoading || sectionsLoading || bannersLoading || layoutLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-bold">Loading your experience...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-white to-blue-100 pt-4 flex-1 flex flex-col">
            <div className="w-full space-y-4 md:space-y-6">
                
                {/* Dynamic Content Stream */}
                {layout.map((item, index) => {
                    if (item.type === 'banner') {
                        const banner = banners.find(b => String(b._id) === String(item.referenceId) || String(b.id) === String(item.referenceId));
                        if (!banner) return null;
                        return (
                            <div key={`${item.type}-${index}`} className="max-w-[1440px] mx-auto px-4 md:px-0">
                                <HomeBanner banner={banner} />
                            </div>
                        );
                    }

                    if (item.type === 'section') {
                        const section = sections.find(s => String(s.id) === String(item.referenceId));
                        if (!section) return null;

                        // Decide layout based on product count or defaults
                        // Use DealGrid for specifically "Deal" types or small sets, otherwise ProductSection slider
                        const isDeal = section.title.toLowerCase().includes('deal') || section.title.toLowerCase().includes('find');
                        const productCount = section.products?.length || 0;
                        
                        if (isDeal && productCount <= 4) {
                             return (
                             <div key={`${item.type}-${index}`} className="max-w-[1440px] mx-auto w-full px-4 md:px-0">
                                <DealGrid
                                    title={section.title}
                                    items={section.products || []}
                                    bgColor="bg-white"
                                    darkBgColor=""
                                    titleKey="name"
                                    subtitleKey="price" // Or discount if available
                                    containerClass="mt-0"
                                    showArrow={true}
                                />
                             </div>
                             );
                        }

                        return (
                            <div key={`${item.type}-${index}`} className="max-w-[1440px] mx-auto w-full px-4 md:px-0">
                                <ProductSection
                                    title={section.title}
                                    subtitle={section.subtitle}
                                    products={section.products}
                                    containerClass="mt-0"
                                    onViewAll={() => navigate(`/products?search=${section.title}`)}
                                />
                            </div>
                        );
                    }

                    return null;
                })}

                {layout.length === 0 && !isLoading && (
                    <div className="py-20 text-center text-gray-400">
                        <p>Welcome! Check back soon for amazing deals.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
