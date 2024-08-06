const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const users = require('@/initial-data/users.json');

const JWT_SECRET = crypto.randomBytes(32).toString('hex');

// Middleware to check for validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    handleValidationErrors
  ],
  (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.login.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
  }
);

module.exports = router;
