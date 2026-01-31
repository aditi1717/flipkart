import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';

// @desc    Global search across products, categories, and subcategories
// @route   GET /api/search
// @access  Public
export const globalSearch = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 1) {
            return res.json({ products: [], categories: [], subCategories: [] });
        }

        const keyword = q;
        const regex = new RegExp(keyword, 'i');

        // Parallel execution for better performance
        const [products, categories, subCategories] = await Promise.all([
            Product.find({
                $or: [
                    { name: regex },
                    { brand: regex },
                    { shortDescription: regex }
                ]
            })
            .select('id name image price brand category subCategories discount')
            .limit(5),

            Category.find({ name: regex })
            .select('id name icon')
            .limit(3),

            SubCategory.find({ name: regex })
            .populate('category', 'name')
            .select('name category')
            .limit(3)
        ]);

        res.json({
            products,
            categories,
            subCategories
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Search failed' });
    }
};
