import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const seed = async () => {
  try {
    const exists = await User.findOne({ login: 'admin' });
    if (exists) {
      console.log('Admin already exists');
      process.exit();
    }
    await User.create({
      name: 'Admin',
      login: 'admin',
      password: 'admin123',
      role: 'ADMIN',
    });
    console.log('Admin created: login=admin, password=admin123');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
