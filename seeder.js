const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        const userExists = await User.findOne({ email: 'admin@gmail.com' });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        // Password will be hashed by the pre-save hook in User model
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: '1234',
            phone: '1234567890',
            role: 'admin',
        });

        await adminUser.save();

        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
