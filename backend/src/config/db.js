import mongoose from 'mongoose';

const validateUri = (mongoUri, label) => {
  if (!mongoUri || !/^mongodb(?:\+srv)?:\/\//i.test(mongoUri)) {
    throw new Error(`Set ${label} to a valid mongodb:// or mongodb+srv:// connection string`);
  }
  if (/[<>]/.test(mongoUri)) {
    throw new Error(`${label} still contains placeholder brackets; use the actual credentials without <> and URL-encode reserved characters`);
  }

  let parsedUri;
  try {
    parsedUri = new URL(mongoUri);
  } catch {
    throw new Error(`${label} is malformed; check the connection string format and URL-encode reserved credential characters`);
  }
  if (!parsedUri.hostname) {
    throw new Error(`${label} must include a MongoDB host`);
  }
  if (process.env.NODE_ENV === 'production' && /^(localhost|127\.0\.0\.1)$/i.test(parsedUri.hostname)) {
    throw new Error(`Production ${label} must point to a remote database`);
  }
  return parsedUri;
};

const connectTo = async (mongoUri, label) => {
  validateUri(mongoUri, label);
  const conn = await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || 'topex',
    serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 10000,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI?.trim();
  validateUri(mongoUri, 'MONGODB_URI');

  try {
    return await connectTo(mongoUri, 'MONGODB_URI');
  } catch (error) {
    const fallbackUri = process.env.MONGODB_FALLBACK_URI?.trim();
    if (!fallbackUri) throw error;

    console.warn(`Primary MongoDB connection failed: ${error.message}`);
    console.warn('Trying MONGODB_FALLBACK_URI...');
    await mongoose.disconnect().catch(() => {});
    return connectTo(fallbackUri, 'MONGODB_FALLBACK_URI');
  }
};

export default connectDB;
