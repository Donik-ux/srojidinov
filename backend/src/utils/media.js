import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);

const VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
]);

export const getMediaBucket = () => {
  if (!mongoose.connection.db) throw new Error('MongoDB is not connected');
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'siteMedia' });
};

const uploadToGridFS = async (file, type) => {
  if (!file?.buffer) {
    const error = new Error('Uploaded file is empty');
    error.status = 400;
    throw error;
  }

  const bucket = getMediaBucket();
  const stream = bucket.openUploadStream(file.originalname || `${type}-${Date.now()}`, {
    contentType: file.mimetype,
    metadata: { uploadedAt: new Date(), type },
  });

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
    stream.end(file.buffer);
  });

  return {
    id: stream.id.toString(),
    url: `/api/media/${stream.id.toString()}`,
    name: file.originalname || '',
    contentType: file.mimetype,
    type,
  };
};

export const saveMedia = async (file) => {
  if (!file?.mimetype) {
    const error = new Error('An image or video file is required');
    error.status = 400;
    throw error;
  }
  if (IMAGE_TYPES.has(file.mimetype)) return uploadToGridFS(file, 'image');
  if (VIDEO_TYPES.has(file.mimetype)) return uploadToGridFS(file, 'video');

  const error = new Error('Please upload a supported image or video file');
  error.status = 415;
  throw error;
};

export const saveImage = async (file) => {
  if (!file?.mimetype?.startsWith('image/')) {
    const error = new Error('Please upload an image file');
    error.status = 415;
    throw error;
  }
  return saveMedia(file);
};

export const saveVideo = async (file) => {
  if (!file?.mimetype?.startsWith('video/')) {
    const error = new Error('Please upload a video file');
    error.status = 415;
    throw error;
  }
  return saveMedia(file);
};

export const pickUploadedFile = (req, preferredFields = []) => {
  const files = Array.isArray(req.files) ? req.files : [];
  if (req.file) return { file: req.file, field: req.file.fieldname };
  for (const field of preferredFields) {
    const found = files.find((item) => item.fieldname === field);
    if (found) return { file: found, field };
  }
  return files.length ? { file: files[0], field: files[0].fieldname } : { file: null, field: null };
};

export const deleteMediaByUrl = async (url) => {
  const match = typeof url === 'string' ? url.match(/\/api\/media\/([a-f\d]{24})$/i) : null;
  if (!match) return;
  await getMediaBucket().delete(new mongoose.Types.ObjectId(match[1])).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
};
