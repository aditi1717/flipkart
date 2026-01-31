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
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-bold">Loading your experience...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark pb-20 pt-1 min-h-screen">
            <div className="max-w-[1440px] mx-auto px-4 md:px-0 space-y-6 md:space-y-8">
                
                {/* Dynamic Content Stream */}
                {layout.map((item, index) => {
                    if (item.type === 'banner') {
                        const banner = banners.find(b => (b.id || b._id) === item.referenceId);
                        if (!banner) return null;
                        return <HomeBanner key={`${item.type}-${index}`} banner={banner} />;
                    }

                    if (item.type === 'section') {
                        const section = sections.find(s => s.id === item.referenceId);
                        if (!section || !section.products || section.products.length === 0) return null;

                        // Decide layout based on product count or defaults
                        // Use DealGrid for specifically "Deal" types or small sets, otherwise ProductSection slider
                        const isDeal = section.title.toLowerCase().includes('deal') || section.title.toLowerCase().includes('find');
                        
                        if (isDeal && section.products.length <= 4) {
                             return (
                                <DealGrid
                                    key={`${item.type}-${index}`}
                                    title={section.title}
                                    items={section.products}
                                    bgColor="bg-white" // Default, maybe add color to HomeSection model later
                                    darkBgColor="dark:bg-gray-800"
                                    titleKey="name"
                                    subtitleKey="price" // Or discount if available
                                    containerClass="mt-4"
                                    showArrow={true}
                                />
                             );
                        }

                        return (
                            <ProductSection
                                key={`${item.type}-${index}`}
                                title={section.title}
                                products={section.products}
                                containerClass="mt-4"
                                onViewAll={() => navigate(`/products?search=${section.title}`)}
                            />
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
