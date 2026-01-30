export const resolveCategoryPath = (categories, products, baseCategoryName, subPathStr) => {
    // 1. Find Base Category
    let current = categories.find(c => c.name.toLowerCase() === baseCategoryName?.toLowerCase());
    if (!current) return null;

    const breadcrumbs = [current];

    // 2. Traverse Sub Path if exists
    if (subPathStr) {
        const segments = subPathStr.split('/').filter(Boolean); // "Mobiles", "Samsung"
        for (const segment of segments) {
            if (current.subCategories) {
                const decodedSegment = decodeURIComponent(segment);
                const found = current.subCategories.find(s => 
                    (typeof s === 'string' ? s : s.name).toLowerCase() === decodedSegment.toLowerCase()
                );
                if (found) {
                    current = typeof found === 'string' ? { name: found, subCategories: [] } : found;
                    breadcrumbs.push(current);
                }
            }
        }
    }

    // 3. Filter Products
    const filteredProducts = products.filter(p => {
        // Match Base Category
        if (p.category === breadcrumbs[0].name) {
            if (breadcrumbs.length > 1) {
                const currentName = current.name.toLowerCase();
                if (p.tags) {
                    return p.tags.some(tag => tag.toLowerCase() === currentName);
                }
                return p.name.toLowerCase().includes(currentName);
            }
            return true;
        }

        // Also check tags for base category match
        if (p.tags && p.tags.some(tag => tag.toLowerCase() === breadcrumbs[0].name.toLowerCase())) {
            if (breadcrumbs.length > 1) {
                const currentName = current.name.toLowerCase();
                return p.tags.some(tag => tag.toLowerCase() === currentName);
            }
            return true;
        }

        return false;
    });

    return {
        data: current,
        breadcrumbs,
        products: filteredProducts,
        isLeaf: !current.subCategories || current.subCategories.length === 0
    };
};
