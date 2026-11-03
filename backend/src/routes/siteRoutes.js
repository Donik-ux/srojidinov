import express from 'express';
const router = express.Router();

let siteContent = {};

// Public
router.get('/content', (req, res) => {
  res.json({ data: siteContent });
});

// Admin
router.get('/admin/content', (req, res) => {
  res.json({ data: siteContent });
});

router.put('/admin/content', (req, res) => {
  siteContent = req.body?.home || req.body || {};
  res.json({ success: true, data: siteContent });
});

router.post('/admin/content', (req, res) => {
  siteContent = req.body?.home || req.body || {};
  res.json({ success: true, data: siteContent });
});

export default router;
