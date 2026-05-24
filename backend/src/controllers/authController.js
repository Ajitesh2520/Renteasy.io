const jwt = require('jsonwebtoken');
const { users } = require('../models/localDb');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    console.log("trying to register user.....")
    const existing = users.find(u => u.email === email);
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = { _id: uuidv4(), name, email, password: hashedPassword, phone, role: 'owner', isActive: true, createdAt: new Date(), updatedAt: new Date() };
    users.push(user);
    const token = signToken(user._id);
    res.status(201).json({ success: true, token, data: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    // Debug: log current users array
    console.log('Current users:', users);
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.json({ success: true, token, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
  // Typo fix: consol -> console
  console.log("login controller executed.....")
};

const getMe = (req, res) => {
  res.json({ success: true, data: req.user });
};

module.exports = { register, login, getMe };
