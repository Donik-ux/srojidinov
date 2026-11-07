import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const REFRESH_COOKIE = 'refreshToken';
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // 'lax' blocks cross-site logout/refresh; set CROSS_SITE_COOKIES=true only if the
  // frontend is hosted on a different site than the API.
  sameSite: process.env.CROSS_SITE_COOKIES === 'true' && process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: REFRESH_MAX_AGE,
});

const clearCookieOptions = () => {
  const { maxAge, ...options } = cookieOptions();
  return options;
};

const createAccessToken = (user) => jwt.sign(
  { id: user._id.toString(), tokenVersion: user.tokenVersion },
  process.env.JWT_SECRET,
  { expiresIn: '15m' },
);

const createRefreshToken = (user) => jwt.sign(
  { id: user._id.toString(), tokenVersion: user.tokenVersion },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '30d' },
);

const sendAuthResponse = (res, user, status = 200) => {
  res.cookie(REFRESH_COOKIE, createRefreshToken(user), cookieOptions());
  res.status(status).json({
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
      phone: user.phone,
      login: user.login,
    },
    accessToken: createAccessToken(user),
  });
};

const isDuplicateKeyError = (error) => error?.code === 11000;

export const register = async (req, res, next) => {
  const { name, phone, login, password } = req.body || {};
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedLogin = typeof login === 'string' ? login.trim().toLowerCase() : '';
  const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';

  if (!normalizedName || (!normalizedPhone && !normalizedLogin) ||
      typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({
      message: 'Name, phone or login, and a password of at least 8 characters are required',
    });
  }

  try {
    const identity = [];
    if (normalizedPhone) identity.push({ phone: normalizedPhone });
    if (normalizedLogin) identity.push({ login: normalizedLogin });
    if (await User.findOne({ $or: identity })) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name: normalizedName,
      phone: normalizedPhone || undefined,
      login: normalizedLogin || undefined,
      password,
    });
    sendAuthResponse(res, user, 201);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({ message: 'User already exists' });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { identifier, login, phone, password } = req.body || {};
  const rawId = identifier || login || phone;
  if (typeof rawId !== 'string' || !rawId.trim() || typeof password !== 'string' || !password) {
    return res.status(400).json({ message: 'Login or phone and password are required' });
  }

  try {
    const id = rawId.trim();
    const user = await User.findOne({ $or: [{ phone: id }, { login: id.toLowerCase() }] });
    if (!user || user.isBlocked || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  res.json({ user: req.user });
};

export const refresh = async (req, res, next) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    res.clearCookie(REFRESH_COOKIE, clearCookieOptions());
    return res.status(401).json({ message: 'Refresh token is invalid or expired' });
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user || decoded.tokenVersion !== user.tokenVersion) {
      res.clearCookie(REFRESH_COOKIE, clearCookieOptions());
      return res.status(401).json({ message: 'Refresh token is invalid or expired' });
    }
    user.tokenVersion += 1;
    await user.save();
    sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (refreshToken) {
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      } catch {
        decoded = null;
      }
      if (decoded) {
        await User.updateOne(
          { _id: decoded.id, tokenVersion: decoded.tokenVersion },
          { $inc: { tokenVersion: 1 } },
        );
      }
    }
    res.clearCookie(REFRESH_COOKIE, clearCookieOptions());
    res.json({ message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};
