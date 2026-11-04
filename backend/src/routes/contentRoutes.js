import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import ContentEntry from '../models/ContentEntry.js';
import Application from '../models/Application.js';
import { admin, optionalProtect, protect } from '../middlewares/auth.js';
import { getMediaBucket, saveImage } from '../utils/media.js';

const router = express.Router();
const publicSections = new Set([
  'courses',
  'blog',
  'directions',
  'teachers',
  'videos',
  'home-videos',
  'gallery',
  'faq',
  'testimonials',
  'scholarships',
  'vacancies',
]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});

const toEntry = (entry) => ({
  _id: entry._id,
  ...entry.data,
  createdAt: entry.createdAt,
  updatedAt: entry.updatedAt,
});

const publicFilter = (section) => section === 'blog'
  ? { 'data.isPublished': true }
  : { $and: [{ 'data.isActive': { $ne: false } }, { 'data.active': { $ne: false } }] };

const pagination = (query) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 100));
  return { page, limit, skip: (page - 1) * limit };
};

const contentQuery = (section, query, isPublic) => {
  const conditions = [{ section }];
  if (isPublic) conditions.push(publicFilter(section));
  if (query.category) conditions.push({ 'data.category': query.category });
  if (query.level) conditions.push({ 'data.level': query.level });
  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    conditions.push({
      $or: [
        { 'data.title': { $regex: escaped, $options: 'i' } },
        { 'data.name': { $regex: escaped, $options: 'i' } },
        { 'data.question': { $regex: escaped, $options: 'i' } },
      ],
    });
  }
  return { $and: conditions };
};

const normalizeBody = (body = {}) => {
  const normalized = {};
  for (const [key, rawValue] of Object.entries(body)) {
    if (typeof rawValue !== 'string') {
      normalized[key] = rawValue;
      continue;
    }

    const value = rawValue.trim();
    if (['isActive', 'active', 'isPublished', 'isFree', 'isFeatured'].includes(key)) {
      normalized[key] = value === 'true';
    } else if (['order', 'price', 'rating', 'grade'].includes(key) && value !== '') {
      const number = Number(value);
      normalized[key] = Number.isFinite(number) ? number : value;
    } else if (['tags', 'features'].includes(key)) {
      normalized[key] = value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
    } else {
      normalized[key] = rawValue;
    }
  }
  return normalized;
};

const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 80);

const handleError = (next, error) => {
  if (error instanceof multer.MulterError) error.status = 400;
  next(error);
};

router.get('/media/:id', async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Media not found' });
  }
  try {
    const bucket = getMediaBucket();
    const [file] = await bucket.find({ _id: new mongoose.Types.ObjectId(req.params.id) }).toArray();
    if (!file) return res.status(404).json({ message: 'Media not found' });
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    bucket.openDownloadStream(file._id).on('error', next).pipe(res);
  } catch (error) {
    next(error);
  }
});

router.post('/applications', async (req, res, next) => {
  const { fullName, name, phone, grade, course } = req.body || {};
  if (typeof (fullName || name) !== 'string' || !(fullName || name).trim() ||
      typeof phone !== 'string' || !phone.trim()) {
    return res.status(400).json({ message: 'Name and phone are required' });
  }
  try {
    const application = await Application.create({
      fullName: (fullName || name).trim(),
      phone: phone.trim(),
      grade: grade ? String(grade) : '',
      course: course || null,
    });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

router.post('/courses/:id/enroll', protect, async (req, res, next) => {
  try {
    const courseFilter = mongoose.isValidObjectId(req.params.id)
      ? { $or: [{ slug: req.params.id }, { _id: req.params.id }] }
      : { slug: req.params.id };
    const course = await ContentEntry.findOne({ section: 'courses', ...courseFilter });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const application = await Application.create({
      fullName: req.user.name,
      phone: req.user.phone || req.user.login || '',
      course: { _id: course._id, title: course.data.title },
    });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

router.post(['/courses', '/blog'], protect, admin, upload.single('image'), async (req, res, next) => {
  const section = req.path.slice(1);
  try {
    const data = normalizeBody(req.body);
    if (!data.title || typeof data.title !== 'string') {
      return res.status(400).json({ message: 'A title is required' });
    }
    if (req.file) data.image = (await saveImage(req.file)).url;
    const baseSlug = slugify(data.slug || data.title) || 'entry';
    const slug = `${baseSlug}-${new mongoose.Types.ObjectId().toString().slice(-6)}`;
    const entry = await ContentEntry.create({
      section,
      slug,
      data: { isActive: true, ...data, slug },
    });
    res.status(201).json({ success: true, data: toEntry(entry) });
  } catch (error) {
    handleError(next, error);
  }
});

router.put(['/courses/:id', '/blog/:id'], protect, admin, upload.single('image'), async (req, res, next) => {
  const section = req.path.split('/')[1];
  try {
    const entry = await ContentEntry.findOne({ section, _id: req.params.id });
    if (!entry) return res.status(404).json({ message: 'Content not found' });
    const updates = normalizeBody(req.body);
    if (req.file) updates.image = (await saveImage(req.file)).url;
    entry.data = { ...entry.data, ...updates };
    await entry.save();
    res.json({ success: true, data: toEntry(entry) });
  } catch (error) {
    handleError(next, error);
  }
});

router.patch(['/courses/:id/publish', '/blog/:id/publish'], protect, admin, async (req, res, next) => {
  const section = req.path.split('/')[1];
  try {
    const entry = await ContentEntry.findOne({ section, _id: req.params.id });
    if (!entry) return res.status(404).json({ message: 'Content not found' });
    const field = section === 'blog' ? 'isPublished' : 'isActive';
    entry.data[field] = !entry.data[field];
    await entry.save();
    res.json({ success: true, data: toEntry(entry) });
  } catch (error) {
    next(error);
  }
});

router.delete(['/courses/:id', '/blog/:id'], protect, admin, async (req, res, next) => {
  const section = req.path.split('/')[1];
  try {
    const entry = await ContentEntry.findOneAndDelete({ section, _id: req.params.id });
    if (!entry) return res.status(404).json({ message: 'Content not found' });
    res.json({ success: true, id: entry._id });
  } catch (error) {
    next(error);
  }
});

router.get('/:section/:slug', optionalProtect, async (req, res, next) => {
  const { section, slug } = req.params;
  if (!publicSections.has(section)) return next();

  try {
    const filter = { section, slug };
    if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role)) {
      Object.assign(filter, publicFilter(section));
    }
    const entry = await ContentEntry.findOne({
      ...filter,
    }).lean();
    if (!entry) return res.status(404).json({ message: 'Content not found' });
    res.json({ data: toEntry(entry) });
  } catch (error) {
    next(error);
  }
});

router.get('/:section', optionalProtect, async (req, res, next) => {
  const { section } = req.params;
  if (!publicSections.has(section)) return next();

  try {
    const { page, limit, skip } = pagination(req.query);
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role);
    const filter = contentQuery(section, req.query, !isAdmin);
    const [entries, total] = await Promise.all([
      ContentEntry.find(filter)
        .sort({ 'data.order': 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContentEntry.countDocuments(filter),
    ]);
    res.json({
      data: entries.map(toEntry),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
