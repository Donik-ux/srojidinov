import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, register, me, refresh, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
const limiter = (limit, windowMinutes, message) => rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  limit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message },
});
const loginLimiter = limiter(10, 15, 'Too many attempts, try again later');
const registerLimiter = limiter(5, 60, 'Too many registrations, try again later');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/me', protect, me);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
