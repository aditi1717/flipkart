import HomeSection from '../models/HomeSection.js';

// @desc    Get all home sections
// @route   GET /api/home-sections
// @access  Public (App) / Private (Admin)
export const getHomeSections = async (req, res) => {
    try {
        const sections = await HomeSection.find({});
        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create/Update home section
// @route   POST /api/home-sections (or PUT)
// @access  Private/Admin
export const createHomeSection = async (req, res) => {
    // This might be used to initialize, but usually we just update existing
    try {
        const { id, title, products } = req.body;
        const section = new HomeSection({
            id: id || Date.now().toString(),
            title,
            products: products || []
        });
        const createdSection = await section.save();
        res.status(201).json(createdSection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update home section (title or products)
// @route   PUT /api/home-sections/:id
// @access  Private/Admin
export const updateHomeSection = async (req, res) => {
    try {
        const section = await HomeSection.findOne({ id: req.params.id });

        if (section) {
            section.title = req.body.title || section.title;
            if (req.body.products) {
                section.products = req.body.products;
            }
            const updatedSection = await section.save();
            res.json(updatedSection);
        } else {
             // If not found, create it? Or 404.
             // For flexibility, if ID is provided, maybe create?
             // Let's stick to 404 for strictness, user should create first or seeder.
            res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete home section
// @route   DELETE /api/home-sections/:id
// @access  Private/Admin
export const deleteHomeSection = async (req, res) => {
    try {
        const section = await HomeSection.findOne({ id: req.params.id });
        if (section) {
            await section.deleteOne();
            res.json({ message: 'Section removed' });
        } else {
            res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
