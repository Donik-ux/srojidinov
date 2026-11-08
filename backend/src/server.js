import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
app.set('etag', false);
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://topextexnikum.uz',
  'https://www.topextexnikum.uz',
  'https://uzmu-sirojiddinov.uz',
  'https://www.uzmu-sirojiddinov.uz',
  'https://srojidinov.vercel.app',
  process.env.CLIENT_URL,
  ...(process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()),
].filter(Boolean);

const vercelPreviewPattern = /^https:\/\/srojidinov[a-z0-9-]*\.vercel\.app$/i;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
      callback(null, true);
      return;
    }

    const error = new Error('Not allowed by CORS');
    error.status = 403;
    callback(error);
  },
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
app.use('/api', rateLimit({ windowMs: 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;
  res.status(isDatabaseConnected ? 200 : 503).json({
    status: isDatabaseConnected ? 'ok' : 'error',
    database: isDatabaseConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/site', siteRoutes);
app.use('/api', siteRoutes);
app.use('/api', contentRoutes);
app.use('/api/admin', adminRoutes);

const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(path.join(frontendDist, 'index.html'))) {
  app.use(express.static(frontendDist, { index: false, maxAge: '7d' }));
  app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error('Request failed:', error.message);
  const status = error.status || error.statusCode || 500;
  res.status(status).json({
    message: status >= 500 ? 'Internal server error' : error.message,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be configured');
  }
  if (process.env.NODE_ENV === 'production' && (
    process.env.JWT_SECRET.length < 32 ||
    process.env.JWT_REFRESH_SECRET.length < 32 ||
    process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET ||
    /change-me|replace/i.test(process.env.JWT_SECRET) ||
    /change-me|replace/i.test(process.env.JWT_REFRESH_SECRET)
  )) {
    throw new Error('Production JWT secrets must be distinct, random values of at least 32 characters');
  }

  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Backend startup failed:', error.message);
  process.exitCode = 1;
});
