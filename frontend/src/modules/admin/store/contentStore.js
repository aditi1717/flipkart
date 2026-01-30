import { create } from 'zustand';
import API from '../../../services/api';

export const useContentStore = create((set, get) => ({
    homeSections: [],
    privacyPolicy: '',
    aboutUs: '',
    seoContent: '',
    isLoading: false,

    // --- Home Sections ---
    fetchHomeSections: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/home-sections');
            set({ homeSections: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    updateSectionTitle: async (id, newTitle) => {
        try {
            const { data } = await API.put(`/home-sections/${id}`, { title: newTitle });
            set((state) => ({
                homeSections: state.homeSections.map(s => s.id === id ? data : s)
            }));
        } catch (error) { console.error(error); }
    },

    addProductToSection: async (sectionId, product) => {
        // Need to add product to the array on backend
        // We fetch current section, append, then save? Or specialized endpoint.
        // Using generic PUT logic
        const state = get();
        const section = state.homeSections.find(s => s.id === sectionId);
        if(!section) return;

        const updatedProducts = [...section.products, product];
        try {
            const { data } = await API.put(`/home-sections/${sectionId}`, { products: updatedProducts });
             set((state) => ({
                homeSections: state.homeSections.map(s => s.id === sectionId ? data : s)
            }));
        } catch (error) { console.error(error); }
    },

    removeProductFromSection: async (sectionId, productId) => {
        const state = get();
        const section = state.homeSections.find(s => s.id === sectionId);
        if(!section) return;

        const updatedProducts = section.products.filter(p => p.id !== productId);
        try {
            const { data } = await API.put(`/home-sections/${sectionId}`, { products: updatedProducts });
             set((state) => ({
                homeSections: state.homeSections.map(s => s.id === sectionId ? data : s)
            }));
        } catch (error) { console.error(error); }
    },

    // --- Content Pages ---
    fetchPages: async () => {
        // Fetch specific pages or all
        try {
            const { data } = await API.get('/pages');
            const pp = data.find(p => p.pageKey === 'privacyPolicy')?.content || '';
            const au = data.find(p => p.pageKey === 'aboutUs')?.content || '';
            const seo = data.find(p => p.pageKey === 'seoContent')?.content || '';
            set({ privacyPolicy: pp, aboutUs: au, seoContent: seo });
        } catch (error) { console.error(error); }
    },

    updateContent: async (key, content) => {
        // Update specific store key locally for UI feel then API
        set(state => ({ [key]: content }));
        try {
            await API.post('/pages', { pageKey: key, content });
        } catch (error) { console.error(error); }
    }
}));
