import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, phone, login, password } = req.body;
    const userExists = await User.findOne({ $or: [{ phone }, { login }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, phone, login, password });
    res.status(201).json({
      user: { _id: user._id, name: user.name, role: user.role, phone: user.phone, login: user.login },
      accessToken: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, login, phone, password } = req.body;
    const id = identifier || login || phone;
    const user = await User.findOne({ $or: [{ phone: id }, { login: id }] });
    if (user && (await user.matchPassword(password))) {
      res.json({
        user: { _id: user._id, name: user.name, role: user.role, phone: user.phone, login: user.login },
        accessToken: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

export const refresh = async (req, res) => {
  res.json({ accessToken: generateToken(req.user._id) });
};

export const logout = async (req, res) => {
  res.json({ message: 'Logged out' });
};
