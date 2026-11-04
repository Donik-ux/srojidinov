import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const optionalProtect = async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user && !user.isBlocked && decoded.tokenVersion === user.tokenVersion) {
      req.user = user;
    }
  } catch {
    // Invalid optional credentials do not restrict public content.
  }
  next();
};

export const protect = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }

  try {
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.isBlocked || decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
    return next();
  }
  res.status(403).json({ message: 'Not authorized as admin' });
};
