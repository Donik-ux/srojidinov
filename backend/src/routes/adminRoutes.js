import express from 'express';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', (req, res) => {
  res.json({ data: { users: 0, applications: 0, courses: 0 } });
});

router.get('/teachers', (req, res) => res.json({ data: [] }));
router.post('/teachers', (req, res) => res.json({ success: true }));
router.put('/teachers/:id', (req, res) => res.json({ success: true }));
router.delete('/teachers/:id', (req, res) => res.json({ success: true }));
router.post('/seed-teachers', (req, res) => res.json({ success: true }));

router.get('/home-videos', (req, res) => res.json({ data: [] }));
router.post('/home-videos', (req, res) => res.json({ success: true }));
router.put('/home-videos/:id', (req, res) => res.json({ success: true }));
router.delete('/home-videos/:id', (req, res) => res.json({ success: true }));

router.get('/translations', (req, res) => res.json({ data: {} }));
router.put('/translations', (req, res) => res.json({ success: true }));
router.post('/translations', (req, res) => res.json({ success: true }));

router.post('/settings/upload-image', (req, res) => {
  res.json({ data: { url: '/uploads/sample.jpg' } });
});

export default router;
