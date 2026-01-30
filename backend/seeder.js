const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');

// Note: Requires manually copying the mock data arrays from frontend or defining them here.
// For this task, I will define a subset of the data directly here to demonstrate functionality
// as reading from the frontend file directly via require might fail due to ES modules syntax there.

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
    },
];

// Simplified data from mockData.js
const categories = [
    {
        id: 1,
        name: "For You",
        icon: "grid_view",
        bannerImage: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/aa1b23763c2c4d6a.jpg?q=20",
        bannerAlt: "Republic Day Sale",
        subCategories: []
    },
    {
        id: 2,
        name: "Fashion",
        icon: "checkroom",
        bannerImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop",
        bannerAlt: "Fashion Sale",
        subCategories: []
    }
];

const products = [
    {
        id: 1,
        name: "Kvinner Casual Regular Fit Tops",
        brand: "Kvinner",
        price: 360,
        originalPrice: 1999,
        discount: "81% off",
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=300",
        category: "Fashion",
        tags: ["Fashion", "Top Wear", "T-Shirts"]
    },
    {
        id: 3,
        name: "Acer Iconia Tab i8 - 4 GB RAM | 64 GB ROM",
        brand: "Acer",
        price: 9990,
        originalPrice: 21999,
        discount: "55% off",
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300&auto=format&fit=crop",
        category: "Electronics",
        tags: ["Electronics", "Tablet"]
    }
];

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        await Product.insertMany(products);
        await Category.insertMany(categories);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        // await Order.deleteMany(); // Added Order require at top if needed

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    // We need to require Order model inside function or at top, forgot it above
    // Adding it now for safety
    try {
         // Re-requiring inside to capture any potential missing reference
         const Order = require('./models/Order');
         importData();
    } catch(e) { console.log(e) }
}
