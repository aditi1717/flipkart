import { create } from 'zustand';

const useCategoryStore = create((set, get) => ({
    categories: [
        {
            id: 1,
            name: 'Electronics',
            image: '',
            active: true,
            children: [
                {
                    id: 11,
                    name: 'Mobiles',
                    image: '',
                    active: true,
                    parentId: 1,
                    children: [
                        { id: 111, name: 'Samsung', active: true, parentId: 11 },
                        { id: 112, name: 'Apple', active: true, parentId: 11 },
                        { id: 113, name: 'Xiaomi', active: true, parentId: 11 },
                    ]
                },
                {
                    id: 12,
                    name: 'Laptops',
                    image: '',
                    active: true,
                    parentId: 1,
                    children: [
                        { id: 121, name: 'Gaming Laptops', active: true, parentId: 12 },
                        { id: 122, name: 'Business Laptops', active: true, parentId: 12 },
                    ]
                },
            ]
        },
        {
            id: 2,
            name: 'Fashion',
            image: '',
            active: true,
            children: [
                {
                    id: 21,
                    name: "Men's Fashion",
                    active: true,
                    parentId: 2,
                    children: [
                        { id: 211, name: 'T-Shirts', active: true, parentId: 21 },
                        { id: 212, name: 'Jeans', active: true, parentId: 21 },
                    ]
                },
                {
                    id: 22,
                    name: "Women's Fashion",
                    active: true,
                    parentId: 2,
                    children: [
                        { id: 221, name: 'Dresses', active: true, parentId: 22 },
                        { id: 222, name: 'Tops', active: true, parentId: 22 },
                    ]
                },
            ]
        },
        {
            id: 3,
            name: 'Home & Kitchen',
            image: '',
            active: true,
            children: []
        }
    ],

    // Get next available ID
    getNextId: () => {
        const allIds = [];
        const extractIds = (items) => {
            items.forEach(item => {
                allIds.push(item.id);
                if (item.children) extractIds(item.children);
            });
        };
        extractIds(get().categories);
        return Math.max(...allIds, 0) + 1;
    },

    // Add category/subcategory
    addCategory: (categoryData) => {
        const newId = get().getNextId();
        const newCategory = { ...categoryData, id: newId, children: [] };

        if (!categoryData.parentId) {
            // Add as root category
            set((state) => ({
                categories: [...state.categories, newCategory]
            }));
        } else {
            // Add as nested subcategory
            const addToParent = (items, parentId, child) => {
                return items.map(item => {
                    if (item.id === parentId) {
                        return {
                            ...item,
                            children: [...(item.children || []), child]
                        };
                    }
                    if (item.children) {
                        return {
                            ...item,
                            children: addToParent(item.children, parentId, child)
                        };
                    }
                    return item;
                });
            };

            set((state) => ({
                categories: addToParent(state.categories, categoryData.parentId, newCategory)
            }));
        }
    },

    // Update category
    updateCategory: (id, updates) => {
        const updateItem = (items) => {
            return items.map(item => {
                if (item.id === id) {
                    return { ...item, ...updates };
                }
                if (item.children) {
                    return { ...item, children: updateItem(item.children) };
                }
                return item;
            });
        };

        set((state) => ({
            categories: updateItem(state.categories)
        }));
    },

    // Delete category
    deleteCategory: (id) => {
        const deleteItem = (items) => {
            return items.filter(item => {
                if (item.id === id) return false;
                if (item.children) {
                    item.children = deleteItem(item.children);
                }
                return true;
            });
        };

        set((state) => ({
            categories: deleteItem(state.categories)
        }));
    },

    // Toggle active status
    toggleCategoryStatus: (id) => {
        get().updateCategory(id, { active: !get().getCategoryById(id)?.active });
    },

    // Get category by ID (recursive search)
    getCategoryById: (id) => {
        const findById = (items) => {
            for (const item of items) {
                if (item.id === id) return item;
                if (item.children) {
                    const found = findById(item.children);
                    if (found) return found;
                }
            }
            return null;
        };
        return findById(get().categories);
    },

    // Get all categories flattened
    getAllCategoriesFlat: () => {
        const flat = [];
        const flatten = (items, level = 0) => {
            items.forEach(item => {
                flat.push({ ...item, level });
                if (item.children) flatten(item.children, level + 1);
            });
        };
        flatten(get().categories);
        return flat;
    }
}));

export default useCategoryStore;
