import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
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
        const product = await Product.findOne({ id: req.params.id });
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
            categoryId: body.categoryId,
            categoryPath: parseJSON(body.categoryPath),
            shortDescription: body.shortDescription,
            highlights: parseJSON(body.highlights),
            specifications: parseJSON(body.specifications),
            features: parseJSON(body.features),
            stock: Number(body.stock),
            variantHeadings,
            skus: parseJSON(body.skus),
            deliveryDays: Number(body.deliveryDays)
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
        console.log('Update Product Request Body:', req.body);
        console.log('Update Product Request Files:', req.files);
        
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
            
            // Parse complex fields if they exist in body
            if (updateData.categoryPath) updateData.categoryPath = parseJSON(updateData.categoryPath);
            if (updateData.highlights) updateData.highlights = parseJSON(updateData.highlights);
            if (updateData.specifications) updateData.specifications = parseJSON(updateData.specifications);
            if (updateData.features) updateData.features = parseJSON(updateData.features);
            if (updateData.skus) updateData.skus = parseJSON(updateData.skus);
            
            if (updateData.variantHeadings) {
                let variantHeadings = parseJSON(updateData.variantHeadings);
                
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
                updateData.variantHeadings = variantHeadings;
            }

            if (updateData.price) updateData.price = Number(updateData.price);
            if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice);
            if (updateData.stock) updateData.stock = Number(updateData.stock);
            if (updateData.deliveryDays) updateData.deliveryDays = Number(updateData.deliveryDays);

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
        res.status(400).json({ message: error.message });
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
