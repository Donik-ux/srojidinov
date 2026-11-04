import express from 'express';
import { login, register, me, refresh, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
