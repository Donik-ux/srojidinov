import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seed = async () => {
  const login = process.env.ADMIN_LOGIN?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!login || !password || password.length < 12) {
    throw new Error('Set ADMIN_LOGIN and an ADMIN_PASSWORD of at least 12 characters before seeding');
  }

  await connectDB();
  const existing = await User.findOne({ login });

  if (existing) {
    existing.name = existing.name || 'Admin';
    existing.password = password;
    existing.role = 'SUPER_ADMIN';
    existing.isBlocked = false;
    existing.tokenVersion = (existing.tokenVersion || 0) + 1;
    await existing.save();
    console.log(`Admin account updated: ${login}`);
    return;
  }

  await User.create({
    name: 'Admin',
    login,
    password,
    role: 'SUPER_ADMIN',
  });
  console.log(`Admin account created: ${login}`);
};

seed()
  .catch((error) => {
    console.error('Admin seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
