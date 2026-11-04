import express from 'express';
import ContentEntry from '../models/ContentEntry.js';
import SiteContent from '../models/SiteContent.js';
import { admin, protect } from '../middlewares/auth.js';

const router = express.Router();
const supportedLanguages = new Set(['uz', 'ru', 'en']);

const getLanguage = (value) => supportedLanguages.has(value) ? value : 'uz';

const activeItems = async (section) => ContentEntry.find({
  section,
  'data.isActive': { $ne: false },
  'data.active': { $ne: false },
}).sort({ 'data.order': 1, createdAt: -1 }).lean();

const readSavedContent = async (language) => {
  const saved = await SiteContent.findOne({ language }).lean();
  const content = saved?.content || {};
  return {
    // New structure: { home: {...}, settings: {...} }
    home: content.home || (content.language ? {} : content),
    settings: content.settings || {},
  };
};

const readGlobalSettings = async () => {
  const settings = await ContentEntry.findOne({ section: 'settings', slug: 'global' }).lean();
  return settings?.data || {};
};

const buildPublicContent = async (language) => {
  const [{ home: savedHome, settings: savedSettings }, globalSettings, directions, teachers, faqs, videos, gallery] = await Promise.all([
    readSavedContent(language),
    readGlobalSettings(),
    activeItems('directions'),
    activeItems('teachers'),
    activeItems('faq'),
    activeItems('home-videos'),
    activeItems('gallery'),
  ]);

  const home = { ...(savedHome || {}) };

  if (!Array.isArray(home.directions) || home.directions.length === 0) {
    if (directions.length) {
      home.directions = directions.map(({ data }) => ({
        ...data,
        title: data.title || data.name || '',
        text: data.text || data.desc || '',
        subjects: data.subjects || data.features || [],
        image: data.image || data.img || '',
      }));
    }
  }

  if (!Array.isArray(home.teachers) || home.teachers.length === 0) {
    if (teachers.length) {
      home.teachers = teachers.map(({ data }) => ({
        ...data,
        subject: data.subject || data.role || '',
      }));
    }
  }

  if (!Array.isArray(home.faqs) || home.faqs.length === 0) {
    if (faqs.length) {
      home.faqs = faqs.map(({ data }) => [data.question || '', data.answer || '']);
    }
  }

  if (!Array.isArray(home.videos) || home.videos.length === 0) {
    if (videos.length) {
      home.videos = videos.map(({ data }) => ({
        title: data.title || '',
        url: data.url || '',
        photo: data.photo || data.image || '',
      }));
    }
  }

  if (!Array.isArray(home.gallery) || home.gallery.length === 0) {
    if (gallery.length) {
      home.gallery = gallery.map(({ data }) => ({
        title: data.title || '',
        image: data.image || data.img || '',
        category: data.category || '',
      }));
    }
  }

  const legacySettings = globalSettings || {};
  const heroFallback = {};
  if (legacySettings.heroTitle) heroFallback.title = legacySettings.heroTitle;
  if (legacySettings.heroSubtitle) heroFallback.subtitle = legacySettings.heroSubtitle;
  if (legacySettings.heroImage) heroFallback.image = legacySettings.heroImage;
  if (legacySettings.heroBgImage) heroFallback.backgroundImage = legacySettings.heroBgImage;

  const aboutFallback = {};
  if (legacySettings.aboutTitle) aboutFallback.title = legacySettings.aboutTitle;
  if (legacySettings.aboutText) aboutFallback.paragraphs = [legacySettings.aboutText];
  if (legacySettings.aboutImage) aboutFallback.image = legacySettings.aboutImage;

  home.hero = { ...heroFallback, ...(home.hero || {}) };
  home.about = { ...aboutFallback, ...(home.about || {}) };
  home.contacts = { ...legacySettings, ...(home.contacts || {}) };
  home.site = { ...legacySettings, ...(savedSettings || {}), ...(home.site || {}) };

  return { home, settings: { ...legacySettings, ...(savedSettings || {}) } };
};

const readSiteContent = async (req, res, next) => {
  try {
    const language = getLanguage(req.query.lang);
    const data = await buildPublicContent(language);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const readAdminSiteContent = async (req, res, next) => {
  try {
    const language = getLanguage(req.query.lang);
    const [saved, globalSettings] = await Promise.all([
      readSavedContent(language),
      readGlobalSettings(),
    ]);
    res.json({
      data: {
        home: saved.home || null,
        settings: { ...globalSettings, ...saved.settings },
      },
    });
  } catch (error) {
    next(error);
  }
};

const readAllAdminSiteContent = async (req, res, next) => {
  try {
    const [savedContent, globalSettings] = await Promise.all([
      SiteContent.find({ language: { $in: [...supportedLanguages] } }).lean(),
      readGlobalSettings(),
    ]);
    const contentByLanguage = Object.fromEntries(
      savedContent.map((entry) => {
        const saved = entry.content || {};
        return [entry.language, {
          home: saved.home || (saved.language ? {} : saved),
          settings: { ...globalSettings, ...(saved.settings || {}) },
        }];
      }),
    );
    res.json({ data: contentByLanguage });
  } catch (error) {
    next(error);
  }
};

const saveSiteContent = async (req, res, next) => {
  try {
    if (!supportedLanguages.has(req.body?.lang)) {
      return res.status(400).json({ message: 'Language must be uz, ru, or en' });
    }

    const language = req.body.lang;
    const home = req.body?.home;
    if (!home || typeof home !== 'object' || Array.isArray(home)) {
      return res.status(400).json({ message: 'A site content object is required' });
    }

    const content = { home };
    if (req.body.settings && typeof req.body.settings === 'object' && !Array.isArray(req.body.settings)) {
      content.settings = req.body.settings;
    }

    const saved = await SiteContent.findOneAndUpdate(
      { language },
      { $set: { content } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    res.json({ success: true, data: saved.content });
  } catch (error) {
    next(error);
  }
};

const saveAllSiteContent = async (req, res, next) => {
  try {
    const languages = req.body?.languages;
    if (!languages || typeof languages !== 'object' || Array.isArray(languages) ||
        [...supportedLanguages].some((language) => !languages[language])) {
      return res.status(400).json({ message: 'Content for uz, ru, and en is required' });
    }

    const operations = [...supportedLanguages].map((language) => {
      const { home, settings } = languages[language] || {};
      if (!home || typeof home !== 'object' || Array.isArray(home) ||
          !settings || typeof settings !== 'object' || Array.isArray(settings)) {
        throw Object.assign(new Error(`Valid home and settings objects are required for ${language}`), { status: 400 });
      }

      return {
        updateOne: {
          filter: { language },
          update: { $set: { content: { home, settings } } },
          upsert: true,
        },
      };
    });

    await SiteContent.bulkWrite(operations, { ordered: true });
    res.json({ success: true, languages: [...supportedLanguages] });
  } catch (error) {
    next(error);
  }
};

router.get('/content', readSiteContent);
router.get('/admin/site/content/all', protect, admin, readAllAdminSiteContent);
router.put('/admin/site/content/all', protect, admin, saveAllSiteContent);
router.get('/admin/site/content', protect, admin, readAdminSiteContent);
router.put('/admin/site/content', protect, admin, saveSiteContent);
router.post('/admin/site/content', protect, admin, saveSiteContent);

router.get('/translations', async (req, res, next) => {
  try {
    const saved = await ContentEntry.findOne({ section: 'translations', slug: 'global' }).lean();
    const data = saved?.data || {};
    if (req.query.lang) {
      const language = getLanguage(req.query.lang);
      return res.json({ data: data[language] || {}, all: data });
    }
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

export default router;
