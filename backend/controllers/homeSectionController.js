import HomeSection from '../models/HomeSection.js';
import HomeLayout from '../models/HomeLayout.js';

// @desc    Get all home sections
// @route   GET /api/home-sections
// @access  Public (App) / Private (Admin)
export const getHomeSections = async (req, res) => {
    try {
        const sections = await HomeSection.find({}).populate('products');
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
        const { id, title, subtitle, products } = req.body;
        const section = new HomeSection({
            id: id || Date.now().toString(),
            title,
            subtitle,
            products: products || []
        });
        const createdSection = await section.save();
        res.status(201).json(createdSection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update home section (title, id, subtitle or products)
// @route   PUT /api/home-sections/:id
// @access  Private/Admin
export const updateHomeSection = async (req, res) => {
    try {
        const sectionId = req.params.id;
        const section = await HomeSection.findOne({ id: sectionId });

        if (section) {
            const oldId = section.id;
            const newId = req.body.id;

            section.title = req.body.title || section.title;
            section.subtitle = req.body.subtitle !== undefined ? req.body.subtitle : section.subtitle;
            
            if (newId && newId !== oldId) {
                section.id = newId;
            }

            if (req.body.products) {
                section.products = req.body.products;
            }

            const updatedSection = await section.save();

            // If ID changed, update HomeLayout references
            if (newId && newId !== oldId) {
                await HomeLayout.updateMany(
                    { "items.referenceId": oldId, "items.type": "section" },
                    { $set: { "items.$[elem].referenceId": newId } },
                    { arrayFilters: [{ "elem.referenceId": oldId, "elem.type": "section" }] }
                );
            }

            await updatedSection.populate('products');
            res.json(updatedSection);
        } else {
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
