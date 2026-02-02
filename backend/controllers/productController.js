import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { category, subcategory } = req.query;
        
        // Build filter object
        let filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (subcategory) {
            // Search for products that have this subcategory
            const SubCategory = (await import('../models/SubCategory.js')).default;
            const subCat = await SubCategory.findOne({ name: subcategory });
            if (subCat) {
                filter.subCategories = subCat._id;
            }
        }
        
        const products = await Product.find(filter)
            .populate('subCategories', 'name')
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id }).populate('subCategories', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        let image = req.body.image;
        if (req.files && req.files.image) {
            image = req.files.image[0].path;
        }

        let images = req.body.images || [];
        if (!Array.isArray(images)) {
            images = [images];
        }
        
        if (req.files && req.files.images) {
            const uploadedImages = req.files.images.map(file => file.path);
            images = [...images, ...uploadedImages];
        }
        images = images.filter(img => img);

        const parseJSON = (data) => {
            if (typeof data === 'string') {
                try { return JSON.parse(data); } catch (e) { return data; }
            }
            return data;
        };

        const body = req.body;
        let variantHeadings = parseJSON(body.variantHeadings);

        if (req.files && req.files.variant_images) {
             const variantFiles = req.files.variant_images;
             if (Array.isArray(variantHeadings)) {
                 variantHeadings = variantHeadings.map(vh => ({
                     ...vh,
                     options: vh.options.map(opt => {
                         if (opt.image && typeof opt.image === 'string' && opt.image.startsWith('VARIANT_INDEX::')) {
                             const idx = parseInt(opt.image.split('::')[1]);
                             if (variantFiles[idx]) {
                                 return { ...opt, image: variantFiles[idx].path };
                             }
                         }
                         return opt;
                     })
                 }));
             }
        }

        const product = new Product({
            id: body.id || Date.now(),
            name: body.name,
            brand: body.brand,
            price: Number(body.price),
            originalPrice: Number(body.originalPrice),
            discount: body.discount,
            image,
            images,
            category: body.category || 'Uncategorized',
            categoryId: body.categoryId ? Number(body.categoryId) : undefined,
            subCategories: parseJSON(body.subCategories) || [], // Handle multiple subcategories
            categoryPath: parseJSON(body.categoryPath),
            description: parseJSON(body.description),
            stock: Number(body.stock),
            variantHeadings,
            skus: parseJSON(body.skus),
            deliveryDays: Number(body.deliveryDays),
            warranty: parseJSON(body.warranty),
            returnPolicy: parseJSON(body.returnPolicy)
        });


        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        console.log('Update Product ID:', req.params.id);
        console.log('Update Body:', JSON.stringify(req.body, null, 2)); // improved logging

        const product = await Product.findOne({ id: req.params.id });

        if (product) {
            let image = req.body.image;
            if (req.files && req.files.image) {
                image = req.files.image[0].path;
            }

            let images = req.body.images || [];
             if (!Array.isArray(images)) {
                images = [images];
            }

            if (req.files && req.files.images) {
                const uploadedImages = req.files.images.map(file => file.path);
                images = [...images, ...uploadedImages];
            }
             
            const parseJSON = (data) => {
                if (typeof data === 'string') {
                    try { return JSON.parse(data); } catch (e) { return data; }
                }
                return data;
            };

            // Prepare update object
            const updateData = { ...req.body };
            
            // Parse complex fields
            if (updateData.categoryPath) updateData.categoryPath = parseJSON(updateData.categoryPath);
            if (updateData.description) updateData.description = parseJSON(updateData.description);
            if (updateData.skus) updateData.skus = parseJSON(updateData.skus);
            if (updateData.warranty) updateData.warranty = parseJSON(updateData.warranty);
            if (updateData.returnPolicy) updateData.returnPolicy = parseJSON(updateData.returnPolicy);
            
            if (updateData.variantHeadings) {
                let variantHeadings = parseJSON(updateData.variantHeadings);
                if (req.files && req.files.variant_images) {
                    // ... (Variant image logic - kept same)
                     const variantFiles = req.files.variant_images;
                     if (Array.isArray(variantHeadings)) {
                         variantHeadings = variantHeadings.map(vh => ({
                             ...vh,
                             options: vh.options.map(opt => {
                                 if (opt.image && typeof opt.image === 'string' && opt.image.startsWith('VARIANT_INDEX::')) {
                                     const idx = parseInt(opt.image.split('::')[1]);
                                     if (variantFiles[idx]) {
                                         return { ...opt, image: variantFiles[idx].path };
                                     }
                                 }
                                 return opt;
                             })
                         }));
                     }
                }
                updateData.variantHeadings = variantHeadings;
            }

            // Safe Number Casting
            const safeNum = (val, prev) => {
                if (val === undefined || val === null || val === '') return undefined;
                const num = Number(val);
                return isNaN(num) ? prev : num;
            };

            if (updateData.price !== undefined) updateData.price = safeNum(updateData.price, product.price);
            if (updateData.originalPrice !== undefined) updateData.originalPrice = safeNum(updateData.originalPrice, product.originalPrice);
            if (updateData.stock !== undefined) updateData.stock = safeNum(updateData.stock, product.stock);
            if (updateData.deliveryDays !== undefined) updateData.deliveryDays = safeNum(updateData.deliveryDays, product.deliveryDays);

            // Fix: Cast categoryId to Number safely
            if (updateData.categoryId !== undefined) {
                const catId = Number(updateData.categoryId);
                updateData.categoryId = isNaN(catId) ? undefined : catId;
            }

            if (updateData.subCategories !== undefined) {
                 updateData.subCategories = parseJSON(updateData.subCategories) || [];
            }

            if (image) updateData.image = image;
            if (images.length > 0) updateData.images = images;

            // Update fields
            Object.assign(product, updateData);
            
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Update Product Fatal Error:', error);
        res.status(500).json({ 
            message: error.message, 
            stack: error.stack 
        });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
