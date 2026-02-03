import { create } from 'zustand';
import API from '../../../services/api';

export const useContentStore = create((set, get) => ({
    homeSections: [],
    homeLayout: [], // { type: 'section' | 'banner', referenceId: string }
    privacyPolicy: '',
    aboutUs: '',
    seoContent: '',
    isLoading: false,

    // --- Home Layout ---
    fetchHomeLayout: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/home-layout');
            set({ homeLayout: data.items || [], isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error("Failed to fetch home layout:", error);
        }
    },

    updateHomeLayout: async (newLayoutItems) => {
        // Optimistic update
        set({ homeLayout: newLayoutItems });
        try {
            // Clean items: Only send valid _id if it's from MongoDB, otherwise strip it
            const cleanedItems = newLayoutItems.map(item => {
                const { _id, type, referenceId } = item;
                if (_id && String(_id).startsWith('temp-')) {
                    return { type, referenceId };
                }
                return { _id, type, referenceId };
            });
            await API.put('/home-layout', { items: cleanedItems });
            
            // Re-fetch to get real DB IDs for newly added items
            get().fetchHomeLayout();
        } catch (error) {
            console.error("Failed to update home layout:", error);
        }
    },

    // --- Home Sections ---
    fetchHomeSections: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/home-sections?all=true');
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

    updateHomeSection: async (oldId, sectionData) => {
        try {
            const { data } = await API.put(`/home-sections/${oldId}`, sectionData);
            set((state) => ({
                homeSections: state.homeSections.map(s => s.id === oldId ? data : s)
            }));
            return data;
        } catch (error) { 
            console.error(error);
            throw error;
        }
    },

    addProductToSection: async (sectionId, product) => {
        // Need to add product to the array on backend
        // We fetch current section, append, then save? Or specialized endpoint.
        // Using generic PUT logic
        const state = get();
        const section = state.homeSections.find(s => s.id === sectionId);
        if(!section) return;

        // Use _id for Mongoose References
        const currentIds = section.products.map(p => typeof p === 'string' ? String(p) : String(p._id));
        const newId = typeof product === 'string' ? String(product) : String(product._id);
        
        if (currentIds.includes(newId)) return; 

        const productIds = [...currentIds, newId]; 
        try {
            const { data } = await API.put(`/home-sections/${sectionId}`, { products: productIds });
             set((state) => ({
                homeSections: state.homeSections.map(s => s.id === sectionId ? data : s)
            }));
        } catch (error) { console.error(error); }
    },

    createHomeSection: async (sectionData) => { // { title: string, id: string }
        try {
            const { data } = await API.post('/home-sections', sectionData);
            set((state) => ({ homeSections: [...state.homeSections, data] }));
        } catch (error) { console.error(error); }
    },

    deleteHomeSection: async (id) => {
        try {
            await API.delete(`/home-sections/${id}`);
            set((state) => ({ homeSections: state.homeSections.filter(s => s.id !== id) }));
        } catch (error) { console.error(error); }
    },

    removeProductFromSection: async (sectionId, productId) => {
        const state = get();
        const section = state.homeSections.find(s => s.id === sectionId);
        if(!section) return;

        // Filter using String comparison
        const currentProducts = section.products;
        const targetId = String(productId); // productId passed here should be _id
        
        // Ensure we extract _id from objects
        const remainingIds = currentProducts
            .map(p => typeof p === 'string' ? String(p) : String(p._id)) 
            .filter(id => id !== targetId);

        try {
            const { data } = await API.put(`/home-sections/${sectionId}`, { products: remainingIds });
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
