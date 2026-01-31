import React from 'react';
import { useContentStore } from '../../../admin/store/contentStore';

const Footer = () => {
    const { seoContent } = useContentStore();

    return (
        <>
            {/* ================= WHY CHOOSE US (SEO TEXT) - DESKTOP ONLY ================= */}
            <div className="hidden md:block bg-[#f1f3f6] border-t border-gray-200 py-10 px-4">
                <div className="max-w-[1440px] mx-auto text-[#565656] text-xs leading-relaxed space-y-4">
                    {seoContent?.split('\n').filter(line => line.trim() !== '').map((line, index) => {
                        // Simple heuristic: Short lines are headings, long lines are content
                        if (line.length < 100 && !line.includes('.')) {
                            return <h2 key={index} className="text-[#878787] uppercase font-bold mb-1 mt-4 text-xs">{line}</h2>;
                        }
                        return <p key={index}>{line}</p>;
                    })}
                </div>
            </div>

            <footer className="w-full bg-[#172337] text-white overflow-hidden text-[12px] font-sans">
                {/* ================= DESKTOP VIEW ================= */}
                <div className="hidden md:block max-w-[1440px] mx-auto px-4 py-10">
                    <div className="flex w-full">
                        {/* LEFT SIDE: 4 COLUMNS OF LINKS */}
                        <div className="flex-[4] grid grid-cols-4 gap-4 border-r border-[#454d5e] pr-8">
                            {/* Column 1: ABOUT */}
                            <div>
                                <h6 className="text-[#878787] uppercase mb-3 font-medium cursor-default">About</h6>
                                <ul className="space-y-1.5 font-medium">
                                    {['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information'].map((item) => (
                                        <li key={item}><a href="#" className="hover:underline">{item}</a></li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 2: HELP */}
                            <div>
                                <h6 className="text-[#878787] uppercase mb-3 font-medium cursor-default">Help</h6>
                                <ul className="space-y-1.5 font-medium">
                                    {['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ', 'Report Infringement'].map((item) => (
                                        <li key={item}><a href="#" className="hover:underline">{item}</a></li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 3: CONSUMER POLICY */}
                            <div>
                                <h6 className="text-[#878787] uppercase mb-3 font-medium cursor-default">Consumer Policy</h6>
                                <ul className="space-y-1.5 font-medium">
                                    {['Cancellation & Returns', 'Terms of Use', 'Security', 'Privacy', 'Sitemap', 'Grievance Redressal', 'EPR Compliance'].map((item) => (
                                        <li key={item}><a href="#" className="hover:underline">{item}</a></li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 4: SOCIAL */}
                            <div>
                                <h6 className="text-[#878787] uppercase mb-3 font-medium cursor-default">Social</h6>
                                <ul className="space-y-1.5 font-medium">
                                    {['Facebook', 'Twitter', 'YouTube', 'Instagram'].map((item) => (
                                        <li key={item}><a href="#" className="hover:underline">{item}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT SIDE: ADDRESS SECTION */}
                        <div className="flex-[2.5] flex pl-8 gap-8 text-[11px] leading-relaxed">
                            <div className="flex-1">
                                <h6 className="text-[#878787] uppercase mb-3 font-medium">Mail Us:</h6>
                                <p>
                                    Flipkart Internet Private Limited,<br />
                                    Buildings Alyssa, Begonia &<br />
                                    Clove Embassy Tech Village,<br />
                                    Outer Ring Road, Devarabeesanahalli Village,<br />
                                    Bengaluru, 560103,<br />
                                    Karnataka, India
                                </p>
                            </div>
                            <div className="flex-1">
                                <h6 className="text-[#878787] uppercase mb-3 font-medium">Registered Office Address:</h6>
                                <p>
                                    Flipkart Internet Private Limited,<br />
                                    Buildings Alyssa, Begonia &<br />
                                    Clove Embassy Tech Village,<br />
                                    Outer Ring Road, Devarabeesanahalli Village,<br />
                                    Bengaluru, 560103,<br />
                                    Karnataka, India<br />
                                    CIN : U51109KA2012PTC066107<br />
                                    Telephone: <span className="text-blue-500">044-45614700</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM BAR */}
                    <div className="border-t border-[#454d5e] mt-10 pt-6">
                        <div className="flex items-center justify-between">
                            {/* Left: Quick Links & Icons */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-[#ffc200] text-sm">stars</span>
                                    <span className="font-medium">Advertise</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-[#ffc200] text-sm">card_giftcard</span>
                                    <span className="font-medium">Gift Cards</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-[#ffc200] text-sm">help</span>
                                    <span className="font-medium">Help Center</span>
                                </div>
                                <span className="ml-4 font-medium">© 2007-2024 Flipkart.com</span>
                            </div>

                            {/* Right: Payment */}
                            <div className="flex items-center gap-2">
                                <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payment Methods" className="h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= MOBILE VIEW (Simplified) ================= */}
                <div className="md:hidden bg-background-light py-6 px-4">
                    <div className="flex flex-col gap-4 text-xs text-gray-500">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                            <a href="#" className="hover:underline">Privacy Policy</a>
                            <a href="#" className="hover:underline">Terms of Use</a>
                            <a href="#" className="hover:underline">Security</a>
                            <a href="#" className="hover:underline">Sitemap</a>
                            <a href="#" className="hover:underline">EPR Compliance</a>
                        </div>
                        <div className="text-center mt-2">
                            <span className="block mb-2">© 2007-2024 Flipkart.com</span>
                            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payment Methods" className="h-4 mx-auto" />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
