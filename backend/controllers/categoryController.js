import Category from '../models/Category.js';

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    try {
        const { name, bannerAlt } = req.body;
        let { subCategories } = req.body;

        let icon = req.body.icon;
        let bannerImage = req.body.bannerImage;

        if (req.files) {
            if (req.files.icon) icon = req.files.icon[0].path;
            if (req.files.bannerImage) bannerImage = req.files.bannerImage[0].path;
        }

         // Parse subCategories if string
        if (typeof subCategories === 'string') {
            try { subCategories = JSON.parse(subCategories); } catch (e) {}
        }
        
        const category = new Category({
            id: Date.now(), // Fallback for simple ID
            name,
            icon,
            bannerImage,
            bannerAlt,
            subCategories
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });

        if (category) {
            let icon = req.body.icon;
            let bannerImage = req.body.bannerImage;

            if (req.files) {
                if (req.files.icon) icon = req.files.icon[0].path;
                if (req.files.bannerImage) bannerImage = req.files.bannerImage[0].path;
            }

            category.name = req.body.name || category.name;
            if (icon) category.icon = icon;
            if (bannerImage) category.bannerImage = bannerImage;
            category.bannerAlt = req.body.bannerAlt || category.bannerAlt;
            
            if (req.body.subCategories) {
                 let subs = req.body.subCategories;
                 if (typeof subs === 'string') {
                    try { subs = JSON.parse(subs); } catch (e) {}
                 }
                 category.subCategories = subs;
            }

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });

        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
