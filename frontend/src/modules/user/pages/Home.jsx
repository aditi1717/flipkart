import { secondaryCategories, fashionValueDeals, interestingFinds, saleBanner } from '../data/mockData';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import DealGrid from '../components/home/DealGrid';
import ProductSection from '../components/home/ProductSection';
import { useProducts } from '../../../hooks/useData';

const Home = () => {
    const addToCart = useCartStore((state) => state.addToCart);
    const navigate = useNavigate();
    const { products, loading: productsLoading } = useProducts();

    return (
        <div className="bg-background-light dark:bg-background-dark pb-8 pt-1">
            {/* Category Navigation */}
            {/* Category Navigation - Moved to Header */}

            <div className="max-w-[1440px] mx-auto px-4 md:px-0">
                {/* Secondary Icon Row - Temporarily Removed on User Request */}
                {/* 
                <section className="bg-white dark:bg-gray-900 py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex overflow-x-auto no-scrollbar gap-6 px-4 md:justify-center md:gap-12">
                        {secondaryCategories.map((cat) => (
                            <div key={cat.id} className="flex flex-col items-center gap-1.5 min-w-[56px] cursor-pointer hover:scale-105 transition-transform">
                                <div className={`${cat.color} w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-transform`}>
                                    <span className="material-icons text-primary md:text-2xl">{cat.icon}</span>
                                </div>
                                <span className="text-[10px] md:text-xs font-semibold text-gray-700 dark:text-gray-300">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
                */}

                {/* Featured Deal Banner (Vivo Style) */}
                <section className="mt-2 md:mt-3">
                    <div className="relative rounded-2xl overflow-hidden h-[180px] md:h-[300px] bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a1a] shadow-xl border border-white/5 group cursor-pointer">
                        <div className="absolute inset-0 flex">
                            <div className="w-1/2 md:w-2/5 p-5 md:pl-16 flex flex-col justify-center z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] md:text-sm font-bold text-blue-400 border border-blue-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Vivo</span>
                                    <span className="text-[10px] md:text-sm font-bold text-yellow-500 uppercase tracking-tighter">Flipkart Unique</span>
                                </div>
                                <h2 className="text-white text-xl md:text-5xl font-black leading-tight tracking-tight uppercase group-hover:underline decoration-yellow-400 decoration-4 underline-offset-4 transition-all">T4 Pro 5G | Steal deal</h2>
                                <p className="text-white text-lg md:text-3xl font-bold mt-1 md:mt-2">From ₹4,250/M*</p>
                                <p className="text-white/60 text-[10px] md:text-base mt-1 leading-tight">Flagship level 3X periscope zoom</p>

                                <div className="mt-4 flex items-center gap-2">
                                    <div className="bg-white/10 backdrop-blur-md rounded p-1.5 md:p-2 flex items-center gap-2 border border-white/10">
                                        <div className="bg-[#1d4ed8] p-0.5 rounded">
                                            <span className="text-[8px] md:text-xs font-bold text-white">HDFC BANK</span>
                                        </div>
                                        <span className="text-[8px] md:text-sm font-bold text-white truncate">Flat ₹3,000 Instant Discount*</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 md:w-3/5 relative">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEBqorOw1nzFs235FA4-dgkHZlzxDMvInFBJdBP7ewPqElzT6CiyiNpMe3H3RetbNb_otxAGe_FJCozdna8wHncQ7sWuSpieB7tsIvPQz8oywlQSkC1NweH_Z4sNHAURspBlnUsojvCexz5qWuLqFSm5iMDTRse2oZDetSu1E9ZFpESOKoOwpE3wJPNFFzz49DStNPsES1OY9eRw-uL2ELze3zys5Mkv_V0Z8PFX0HGBB-Pivq8Yzvw0UHFbiyIWiYL_0c6Ie4YkB2"
                                    alt="Vivo T4 Pro"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 h-[90%] md:h-[110%] object-contain scale-110 md:scale-100 rotate-[-10deg] md:rotate-0 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105 duration-500"
                                />
                                <div className="absolute bottom-4 right-4 bg-yellow-400 text-black px-2 py-1 rounded-lg text-[10px] md:text-lg font-black uppercase italic shadow-lg">
                                    3X <span className="block text-[8px] md:text-xs -mt-1 md:-mt-1.5">Periscope Camera</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Best Value Deals on Fashion - New Section */}
                <DealGrid
                    title="Best Value Deals on Fashion"
                    items={fashionValueDeals}
                    bgColor="bg-[#ffdcb4]"
                    darkBgColor="dark:bg-[#4d3420]"
                    titleKey="name"
                    subtitleKey="discount"
                    containerClass="mt-4"
                    isScrollable={true}
                    showArrow={false}
                />

                {/* Popular Grocery Products Section */}
                {productsLoading ? (
                    <div className="mt-6 text-center text-gray-500">Loading products...</div>
                ) : (
                    <ProductSection
                        title="Popular Grocery Products for You"
                        products={products.filter(p => p.category === 'Grocery').slice(0, 6)}
                        containerClass="mt-6"
                        onViewAll={() => navigate('/products?category=Grocery&title=Popular Grocery Products for You')}
                    />
                )}

                {/* Suggested For You - Health & Wellness Grid */}
                 {productsLoading ? (
                    <div className="mt-8 text-center text-gray-500">Loading products...</div>
                ) : (
                    <ProductSection
                        title="Suggested For You"
                        products={products.filter(p => p.category === 'Health').slice(0, 6)}
                        containerClass="mt-8"
                        onViewAll={() => navigate('/products?category=Health&title=Suggested For You')}
                    />
                )}

                {/* Main Banner */}
                <section className="mt-4 px-4 hidden md:block">
                    {/* Can be merged with carousel above or kept separate. */}
                </section>

                {/* Main Banner */}

                {/* Still looking for these? Section - Replaced with DealGrid */}
                <DealGrid
                    title="Still looking for these?"
                    items={[
                        { name: 'Wrist Watches', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbsLxVfrCe93-OLiYks24IIcjOTMhvCNz1T1n-slfK_j0tnq0pfM8C_YBk5M7MY6c12PASfvxVsReDMMeGG6t8X8D8ijVUgnZL-FVNQNqr-Y0n2X0gFd6eE1PGA8H_DMW7SP9jTnt4Bt3xeAgH6ff460XzxzURrKyKfLlggArMrawh-qP8EKJdeeaPYLzXbynYzLroYSH6ydb8sUjuFNuvSVVs8BAA7K41_kV3EFvE9Xd5dtNLf2NbDv5XKC6ICVio61VfAI14HZRV', discount: 'Min 50% Off' },
                        { name: 'Moisturizer', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcfi80zpx4HBcNHUuVKsHUUiItM31qhtJEQ_hVUPBR8TIRxTDeTKjPP686MjNEFPuBQq75oNgtT3I8_JraqzmWFC9KQKJldt48KVCfYGm1XpNk_1yqb-rj4n2N7at_U7rOoAlixOyJQJPeyuGjqRrAyAOnyXwEPnCthrzNgGQFT_-lUNfNV7gZPnoMTWwdJh-VuF9o6yuVf0cHif3P7taJu4n-MZU0It4HoRZoHoGe894mj_ILaatik79ijROO_8MIf3MpCOHaSsdB', discount: 'Special Offer' },
                        { name: 'Laptops', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300&auto=format&fit=crop', discount: 'From ₹14,990' },
                        { name: 'Smartphones', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop', discount: 'Just ₹6,999' },
                        { name: 'Headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop', discount: 'Up to 70% Off' },
                    ]}
                    bgColor="bg-[#d4f4dd]"
                    darkBgColor="dark:bg-[#1a2e1d]"
                    titleKey="name"
                    subtitleKey="discount"
                    imageKey="img"
                    showArrow={false}
                    containerClass="mt-8"
                    isScrollable={true}
                    showStamp={true}
                    stampText="PREMIUM QUALITY"
                />


                {/* Interesting finds Section - Styled as per screenshot */}
                <DealGrid
                    title="Interesting finds"
                    items={interestingFinds}
                    bgColor="bg-[#ffe8d6]"
                    darkBgColor="dark:bg-[#3d2c22]"
                    titleKey="title"
                    subtitleKey="tag"
                    showArrow={false}
                    showStamp={true}
                    stampText="NEW DELHI INDIA"
                    containerClass="mt-8"
                    isScrollable={true}
                />

                {/* Republic Day Sale Banner */}
                <section className="mt-8">
                    <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer active:scale-[0.98] transition-transform group relative h-[180px] md:h-[300px]">
                        <img
                            src={saleBanner.image}
                            alt={saleBanner.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                            }}
                        />
                        <div className="absolute inset-0 bg-white/10 flex items-center p-6">
                            <div className="max-w-[70%]">
                                <h2 className="text-xl md:text-3xl font-black text-[#1a237e] uppercase tracking-tighter leading-none mb-1 group-hover:translate-x-2 transition-transform">REPUBLIC DAY SALE</h2>
                                <p className="text-sm md:text-xl font-bold text-[#1565c0] italic tracking-wide group-hover:translate-x-2 transition-transform delay-75">SALE IS LIVE!</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sponsored Brand Banner (Smartwatch Style) */}
                <section className="mt-8">
                    <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-lg md:text-2xl font-bold dark:text-white">Sponsored</h3>
                    </div>
                    <div className="relative rounded-3xl overflow-hidden h-[180px] md:h-[300px] bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 border border-blue-200 dark:border-blue-800 cursor-pointer group hover:shadow-xl transition-shadow">
                        <div className="absolute inset-0 p-6 md:p-12 flex items-center">
                            <div className="w-1/2 md:w-1/3">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiLyZ4P3mIP88ssCS5y0D6NcAPHCHAmFyupct4ZfQZjJzPmhKXsPMlNqSkYBgnSfvFrCmSoZPopkWn6eTN4nkKUwpw_w61MGNoyXBXLICzWqBzBBCamSvu2vx_sxyfgskLwDvzOcJqFSTmCh4JMPlYBZdyTf3Rn91ajuXTK99suBHjiT_9P1z4k2kOgmWNAEuUDHUh7J4DqfRBTNKRrYDa2t2Qo7qnv4RSpq8k2fWk5twIi0UMnwgY1z4Fi01fYSjx9D0pwdZLfEZJ"
                                    alt="Fire-Boltt"
                                    className="h-6 md:h-10 mb-4 md:mb-6 object-contain opacity-80"
                                />
                                <h4 className="text-[#e67e22] text-xs md:text-sm font-black tracking-widest uppercase mb-1">Ninja Calling</h4>
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-2">1.83" BT Calling</h2>
                                <p className="text-xs md:text-lg font-bold text-gray-600 dark:text-gray-300">120+ Sports Modes</p>
                                <button className="hidden md:block mt-6 bg-gray-900 text-white px-6 py-2 rounded-full font-bold hover:bg-black transition-colors">
                                    Shop Now
                                </button>
                            </div>
                            <div className="w-1/2 md:w-2/3 h-full flex items-center justify-center relative">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf6ewFiuOXh7FVNU3VtDYqaWcSaOwt4sEFe2-gNiT7M6LwOIKIm9BXXKjkc6WdPpSYUx3CqdoShRm2bUFfdiiQtuH1vYm-KoaSAra9NL-uEAKL6fLp1utl6fKDvtmRDFdOuft8JzJijxeYTdgTIBDThhSSRiMSx533QFjuihrMhiWCsdLucKbF_JkqVveWjULdLbvpGRMBUR6H8kwW-oVAZ5dxutEL08Ms33cKuxYCpLeoEmsx_HvuGpOjtsWwH2ikYkF3OTRz7uPb"
                                    alt="Smartwatch"
                                    className="h-[120%] md:h-[130%] object-contain drop-shadow-2xl translate-x-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 py-2.5 px-6 md:px-12 bg-[#ff6b35] flex items-center justify-between">
                            <span className="text-white text-sm md:text-xl font-black">Spl. price ₹999*</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className={`h-1.5 md:h-2 rounded-full ${i === 4 ? 'w-6 md:w-8 bg-white' : 'w-1.5 md:w-2 bg-white/40'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recently Viewed Section */}
                {productsLoading ? null : (
                    <ProductSection
                        title="Recently Viewed"
                        products={products.filter(p => p.category === 'Electronics').slice(0, 6)}
                        containerClass="mt-8"
                        onViewAll={() => navigate('/products?category=Electronics&title=Recently Viewed')}
                    />
                )}

            </div>
        </div>
    );
};

export default Home;
