import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import Application from '../models/Application.js';
import ContentEntry from '../models/ContentEntry.js';
import User from '../models/User.js';
import { admin, protect } from '../middlewares/auth.js';
import { getMediaBucket, saveMedia, pickUploadedFile } from '../utils/media.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024, files: 5 },
});
const managedSections = new Set([
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
const applicationStatuses = new Set([
  'yangi',
  "ko'rib_chiqilmoqda",
  'qabul_qilindi',
  'rad_etildi',
]);

router.use(protect, admin);

const asEntry = (entry) => ({
  _id: entry._id,
  ...entry.data,
  createdAt: entry.createdAt,
  updatedAt: entry.updatedAt,
});

const parseBody = (body = {}) => {
  const parsed = {};
  for (const [key, raw] of Object.entries(body)) {
    if (typeof raw !== 'string') {
      parsed[key] = raw;
    } else if (['active', 'isActive', 'isPublished', 'isFree', 'isFeatured'].includes(key)) {
      parsed[key] = raw === 'true';
    } else if (['order', 'price', 'rating', 'grade'].includes(key) && raw.trim()) {
      const number = Number(raw);
      parsed[key] = Number.isFinite(number) ? number : raw;
    } else if (['tags', 'features'].includes(key)) {
      parsed[key] = raw ? raw.split(',').map((item) => item.trim()).filter(Boolean) : [];
    } else {
      parsed[key] = raw;
    }
  }
  return parsed;
};

const createSlug = (data) => {
  const source = data.slug || data.title || data.name || data.question || data.year || 'entry';
  const normalized = String(source).normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const base = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
  return `${base || 'entry'}-${new mongoose.Types.ObjectId().toString().slice(-6)}`;
};

const getPage = (query) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 100));
  return { page, limit, skip: (page - 1) * limit };
};

const withSearch = (filter, search, fields) => {
  if (typeof search !== 'string' || !search) return filter;
  const escaped = search.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return {
    $and: [
      filter,
      { $or: fields.map((field) => ({ [field]: { $regex: escaped, $options: 'i' } })) },
    ],
  };
};

const getOrCreateSingleton = async (section) => (
  ContentEntry.findOne({ section, slug: 'global' })
);

const saveSingleton = async (section, data) => (
  ContentEntry.findOneAndUpdate(
    { section, slug: 'global' },
    { $set: { data } },
    { new: true, upsert: true, runValidators: true },
  )
);

const paginateResponse = async (res, model, filter, page, limit, skip, sort = { createdAt: -1 }) => {
  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);
  res.json({
    data: data.map((item) => item.toObject ? item.toObject() : item),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const week = new Date(now);
    week.setDate(now.getDate() - 7);
    const [
      totalUsers,
      totalCourses,
      totalArticles,
      totalApplications,
      newApplications,
      todayApplications,
      weekApplications,
      applicationsByStatus,
      recentUsers,
      recentApplications,
    ] = await Promise.all([
      User.countDocuments(),
      ContentEntry.countDocuments({ section: 'courses' }),
      ContentEntry.countDocuments({ section: 'blog' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'yangi' }),
      Application.countDocuments({ createdAt: { $gte: today } }),
      Application.countDocuments({ createdAt: { $gte: week } }),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      User.find().select('-password').sort({ createdAt: -1 }).limit(5).lean(),
      Application.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        totalArticles,
        totalApplications,
        newApplications,
        todayApplications,
        weekApplications,
        applicationsByStatus,
      },
      recentUsers,
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};

router.get(['/stats', '/dashboard'], getDashboard);

router.get('/users', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPage(req.query);
    const filter = {};
    if (['USER', 'ADMIN', 'SUPER_ADMIN'].includes(req.query.role)) {
      filter.role = req.query.role;
    }
    const searchFilter = withSearch(filter, req.query.search, ['name', 'login', 'phone']);
    const [users, total] = await Promise.all([
      User.find(searchFilter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(searchFilter),
    ]);
    res.json({ data: users, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id/toggle-block', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid user id' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'USER' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Only a super admin can change this account' });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, data: { _id: user._id, isBlocked: user.isBlocked } });
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid user id' });
    const { role } = req.body || {};
    if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Only a super admin can change roles' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Only a super admin can change this account' });
    }
    user.role = role;
    await user.save();
    res.json({ success: true, data: { _id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid user id' });
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'USER' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Only a super admin can delete this account' });
    }
    await user.deleteOne();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/applications', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPage(req.query);
    const filter = {};
    if (applicationStatuses.has(req.query.status)) filter.status = req.query.status;
    if (req.query.grade) filter.grade = String(req.query.grade);
    const searchFilter = withSearch(filter, req.query.search, ['fullName', 'phone', 'note']);
    await paginateResponse(
      res,
      Application,
      searchFilter,
      page,
      limit,
      skip,
    );
  } catch (error) {
    next(error);
  }
});

router.put('/applications/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid application id' });
    const updates = {};
    if (req.body?.status !== undefined) {
      if (!applicationStatuses.has(req.body.status)) {
        return res.status(400).json({ message: 'Invalid application status' });
      }
      updates.status = req.body.status;
    }
    if (req.body?.note !== undefined) updates.note = String(req.body.note).slice(0, 5000);
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

router.delete('/applications/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid application id' });
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/settings', async (req, res, next) => {
  try {
    const settings = await getOrCreateSingleton('settings');
    res.json({ data: settings?.data || {} });
  } catch (error) {
    next(error);
  }
});

router.put('/settings', async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Settings object is required' });
    }
    const settings = await saveSingleton('settings', req.body);
    res.json({ success: true, data: settings.data });
  } catch (error) {
    next(error);
  }
});

router.get('/translations', async (req, res, next) => {
  try {
    const translations = await getOrCreateSingleton('translations');
    res.json({ data: translations?.data || {} });
  } catch (error) {
    next(error);
  }
});

const saveTranslations = async (req, res, next) => {
  try {
    const { uz, ru, en } = req.body || {};
    if (![uz, ru, en].every((value) => value && typeof value === 'object' && !Array.isArray(value))) {
      return res.status(400).json({ message: 'Translations for uz, ru, and en are required' });
    }
    const translations = await saveSingleton('translations', { uz, ru, en });
    res.json({ success: true, data: translations.data });
  } catch (error) {
    next(error);
  }
};
router.put('/translations', saveTranslations);
router.post('/translations', saveTranslations);

router.get('/media', async (req, res, next) => {
  try {
    const files = await getMediaBucket().find().sort({ uploadDate: -1 }).limit(100).toArray();
    res.json({
      data: files.map((file) => ({
        _id: file._id,
        name: file.filename,
        contentType: file.contentType,
        url: `/api/media/${file._id.toString()}`,
        uploadedAt: file.uploadDate,
      })),
    });
  } catch (error) {
    next(error);
  }
});

const uploadMedia = async (req, res, next) => {
  try {
    const { file } = pickUploadedFile(req, ['image', 'video', 'file', 'photo']);
    if (!file) return res.status(400).json({ message: 'An image or video file is required' });
    const saved = await saveMedia(file);
    res.status(201).json({ success: true, data: saved, url: saved.url });
  } catch (error) {
    if (error instanceof multer.MulterError) error.status = 400;
    next(error);
  }
};

router.post('/settings/upload-image', upload.any(), uploadMedia);
router.post('/media', upload.any(), uploadMedia);
router.post('/upload', upload.any(), uploadMedia);

const applyMediaField = (data, field, url) => {
  if (field === 'video') data.url = url;
  else if (field === 'photo') data.photo = url;
  else data.image = url;
};

const homeVideoUpload = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
]);

const saveHomeVideoMedia = async (req, data) => {
  const files = Array.isArray(req.files) ? req.files : [];
  for (const file of files) {
    const saved = await saveMedia(file);
    applyMediaField(data, file.fieldname, saved.url);
  }
};

router.post('/home-videos', homeVideoUpload, async (req, res, next) => {
  try {
    const data = parseBody(req.body);
    data.isActive ??= true;
    await saveHomeVideoMedia(req, data);
    if (!data.title || !String(data.title).trim()) {
      return res.status(400).json({ message: 'A title is required' });
    }
    if (!data.url) {
      return res.status(400).json({ message: 'A video file or video URL is required' });
    }
    const entry = await ContentEntry.create({ section: 'home-videos', slug: createSlug(data), data });
    res.status(201).json({ success: true, data: asEntry(entry) });
  } catch (error) {
    if (error instanceof multer.MulterError) error.status = 400;
    next(error);
  }
});

router.put('/home-videos/:id', homeVideoUpload, async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid content id' });
  try {
    const entry = await ContentEntry.findOne({ section: 'home-videos', _id: id });
    if (!entry) return res.status(404).json({ message: 'Content not found' });
    const updates = parseBody(req.body);
    await saveHomeVideoMedia(req, updates);
    entry.data = { ...entry.data, ...updates };
    await entry.save();
    res.json({ success: true, data: asEntry(entry) });
  } catch (error) {
    if (error instanceof multer.MulterError) error.status = 400;
    next(error);
  }
});

const seedIfEmpty = async (section, items) => {
  const existing = await ContentEntry.countDocuments({ section });
  if (existing) return { inserted: 0, message: `${section} already contain data` };
  await ContentEntry.insertMany(items.map((data) => ({
    section,
    slug: createSlug(data),
    data: { isActive: true, ...data },
  })));
  return { inserted: items.length, message: `${items.length} ${section} records added` };
};

const defaultDirections = [
  {
    name: 'Aniq fanlar',
    icon: 'Atom',
    order: 0,
    active: true,
    desc: 'Mantiqiy tafakkur, hisob-kitob va fizik hodisalarni chuqur o‘rganishga yo‘naltirilgan guruhlar.',
    duration: '',
    img: '',
    features: ['Matematika', 'Fizika'],
  },
  {
    name: 'Tabiiy fanlar',
    icon: 'Microscope',
    order: 1,
    active: true,
    desc: 'Tirik organizmlar, moddalar tuzilishi va laboratoriya tadqiqotlariga asoslangan tayyorgarlik.',
    duration: '',
    img: '',
    features: ['Kimyo', 'Biologiya'],
  },
  {
    name: 'Iqtisod',
    icon: 'TrendingUp',
    order: 2,
    active: true,
    desc: 'Iqtisodiy tafakkur, moliyaviy savodxonlik va xalqaro muloqot ko‘nikmalarini rivojlantirishga qaratilgan guruhlar.',
    duration: '',
    img: '',
    features: ['Matematika', 'Ingliz tili'],
  },
];

const defaultTeachers = [
  { name: 'Karimova Ziynat', role: 'Matematika', order: 0, active: true, image: '/assets/Ustozlar/karimova-ziynat.jpg' },
  { name: 'Po‘latova Mazluma', role: 'Matematika', order: 1, active: true, image: '/assets/Ustozlar/polatova-mazluma.jpg' },
  { name: 'Yermatov Shermuhammad', role: 'Jismoniy Tarbiya', order: 2, active: true, image: '/assets/Ustozlar/yermatov-shermuhammad.jpg' },
  { name: 'Xatarova Munira', role: 'Matematika', order: 3, active: true, image: '/assets/Ustozlar/xatarova-munira.jpg' },
  { name: 'Saidova Zulfizar', role: 'Matematika', order: 4, active: true, image: '/assets/Ustozlar/saidova-zulfizar.jpg' },
];

router.post(['/seed-directions', '/directions/seed'], async (req, res, next) => {
  try {
    const result = await seedIfEmpty('directions', defaultDirections);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

router.post('/seed-teachers', async (req, res, next) => {
  try {
    const result = await seedIfEmpty('teachers', defaultTeachers);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

router.post('/drop-email-index', async (req, res, next) => {
  try {
    const indexes = await User.collection.indexes();
    if (indexes.some((index) => index.name === 'email_1')) {
      await User.collection.dropIndex('email_1');
      return res.json({ success: true, message: 'Legacy email index removed' });
    }
    res.json({ success: true, message: 'No legacy email index found' });
  } catch (error) {
    next(error);
  }
});

router.get('/:section', async (req, res, next) => {
  const { section } = req.params;
  if (!managedSections.has(section)) return next();
  try {
    const { page, limit, skip } = getPage(req.query);
    const filter = withSearch({ section }, req.query.search, ['data.title', 'data.name', 'data.question']);
    const [entries, total] = await Promise.all([
      ContentEntry.find(filter).sort({ 'data.order': 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContentEntry.countDocuments(filter),
    ]);
    res.json({
      data: entries.map(asEntry),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:section', upload.any(), async (req, res, next) => {
  const { section } = req.params;
  if (!managedSections.has(section)) return next();
  try {
    const data = parseBody(req.body);
    const files = Array.isArray(req.files) ? req.files : [];
    for (const file of files) {
      const saved = await saveMedia(file);
      applyMediaField(data, file.fieldname, saved.url);
    }
    if (!Object.keys(data).length) return res.status(400).json({ message: 'Content fields are required' });
    data.isActive ??= true;
    const entry = await ContentEntry.create({ section, slug: createSlug(data), data });
    res.status(201).json({ success: true, data: asEntry(entry) });
  } catch (error) {
    if (error instanceof multer.MulterError) error.status = 400;
    next(error);
  }
});

router.put('/:section/:id', upload.any(), async (req, res, next) => {
  const { section, id } = req.params;
  if (!managedSections.has(section)) return next();
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid content id' });
  try {
    const entry = await ContentEntry.findOne({ section, _id: id });
    if (!entry) return res.status(404).json({ message: 'Content not found' });
    const updates = parseBody(req.body);
    const files = Array.isArray(req.files) ? req.files : [];
    for (const file of files) {
      const saved = await saveMedia(file);
      applyMediaField(updates, file.fieldname, saved.url);
    }
    entry.data = { ...entry.data, ...updates };
    await entry.save();
    res.json({ success: true, data: asEntry(entry) });
  } catch (error) {
    if (error instanceof multer.MulterError) error.status = 400;
    next(error);
  }
});

router.delete('/:section/:id', async (req, res, next) => {
  const { section, id } = req.params;
  if (!managedSections.has(section)) return next();
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid content id' });
  try {
    const entry = await ContentEntry.findOneAndDelete({ section, _id: id });
    if (!entry) return res.status(404).json({ message: 'Content not found' });
    res.json({ success: true, id: entry._id });
  } catch (error) {
    next(error);
  }
});

router.use((req, res) => {
  res.status(404).json({ message: 'Admin API route not found' });
});

export default router;
