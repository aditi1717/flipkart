import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useContentStore = create(
    persist(
        (set) => ({
            privacyPolicy: `
We value the trust you place in us. That's why we insist upon the highest standards for secure transactions and customer information privacy. Please read the following statement to learn about our information gathering and dissemination practices.

1. Collection of Personally Identifiable Information and other Information
When you use our Website, we collect and store your personal information which is provided by you from time to time. Our primary goal in doing so is to provide you a safe, efficient, smooth and customized experience.

2. Use of Demographic / Profile Data / Your Information
We use personal information to provide the services you request. To the extent we use your personal information to market to you, we will provide you the ability to opt-out of such uses.

3. Security Precautions
Our Website has stringent security measures in place to protect the loss, misuse, and alteration of the information under our control. Whenever you change or access your account information, we offer the use of a secure server.
            `,
            aboutUs: `
Flipkart is India's leading e-commerce marketplace with over 80 million products across 80+ categories.

Launched in October 2007, Flipkart has become the preferred online marketplace for leading Indian and international brands.

Our Mission
We want to create a place for people who want to be real, to come together and do real things.

Our Values
- Audacity
- Bias for Action
- Customer First
- Integrity
- Inclusion
            `,
            seoContent: `
IndianKart: The One-stop Shopping Destination
E-commerce is revolutionizing the way we all shop in India. Why do you want to hop from one store to another in search of the latest phone when you can find it on the Internet in a single click? Not only mobiles. IndianKart houses everything you can possibly imagine, from trending electronics like laptops, tablets, smartphones, and mobile accessories to in-vogue fashion staples like shoes, clothing and lifestyle accessories; from modern furniture like sofa sets, dining tables, and wardrobes to appliances that make your life easy like washing machines, TVs, ACs, mixer grinder juicers and other time-saving kitchen and small appliances; from home furnishings like cushion covers, mattresses sheets and bedsheets to toys and musical instruments, we got them all covered. You name it, and you can stay assured about finding them all here. For those of you with erratic working hours, IndianKart is your best bet. Shop in your PJs, at night or in the wee hours of the morning. This e-commerce never shuts down.

No Cost EMI
In an attempt to make high-end products accessible to all, our No Cost EMI plan enables you to shop with us under EMI, without shelling out any processing fee. Applicable on select mobiles, laptops, large and small appliances, furniture, electronics and watches, you can now shop without burning a hole in your pocket. If you've been eyeing a product for a long time, chances are it may be up for a no cost EMI. Take a look ASAP! Terms and conditions apply.

Mobile Exchange Offers
Get an instant discount on the phone that you have been eyeing on. Exchange your old mobile for a new one after the IndianKart experts calculate the value of your old phone, provided it is in a working condition without damage to the screen. If a phone is applicable for an exchange offer, you will see the 'Buy with Exchange' option on the product description of the phone. So, be smart, always opt for an exchange wherever possible. Terms and conditions apply.

What Can You Buy From IndianKart?
Mobile Phones
From budget phones to state-of-the-art smartphones, we have a mobile for everybody out there. Whether you're looking for larger, fuller screens, power-packed batteries, blazing-fast processors, beautification apps, high-tech selfie cameras or just large internal space, we take care of all your essentials. Shop from Top Brands like Samsung, Apple, Oppo, Xiaomi, Realme, Vivo, and Honor to name a few. Rest assured, you're buying from only the most reliable names in the market. What's more, with IndianKart's Complete Mobile Protection Plan, you will never again find the need to worry about a broken screen. No matter what the issue is.
            `,
            homeSections: [
                { id: 'fashion-deals', title: 'Best Value Deals on Fashion', products: [], banners: [] },
                { id: 'grocery-popular', title: 'Popular Grocery Products for You', products: [], banners: [] },
                { id: 'suggested', title: 'Suggested For You', products: [], banners: [] },
                { id: 'interesting-finds', title: 'Interesting finds', products: [], banners: [] },
                { id: 'still-looking', title: 'Still looking for these?', products: [], banners: [] },
                { id: 'recently-viewed', title: 'Recently Viewed', products: [], banners: [] }
            ],
            homeBanners: [],
            updateContent: (type, content) => set((state) => ({ [type]: content })),
            updateSectionTitle: (id, title) => set((state) => ({
                homeSections: state.homeSections.map(s => s.id === id ? { ...s, title } : s)
            })),
            addProductToSection: (sectionId, product) => set((state) => ({
                homeSections: state.homeSections.map(s =>
                    s.id === sectionId
                        ? { ...s, products: [...s.products.filter(p => p.id !== product.id), product] }
                        : s
                )
            })),
            removeProductFromSection: (sectionId, productId) => set((state) => ({
                homeSections: state.homeSections.map(s =>
                    s.id === sectionId
                        ? { ...s, products: s.products.filter(p => p.id !== productId) }
                        : s
                )
            })),
            addHomeBanner: (banner) => set((state) => ({
                homeBanners: [...state.homeBanners, { ...banner, id: Date.now() }]
            })),
            updateHomeBanner: (id, updatedBanner) => set((state) => ({
                homeBanners: state.homeBanners.map(b => b.id === id ? { ...b, ...updatedBanner } : b)
            })),
            deleteHomeBanner: (id) => set((state) => ({
                homeBanners: state.homeBanners.filter(b => b.id !== id)
            })),
        }),
        {
            name: 'admin-content-storage',
        }
    )
);
