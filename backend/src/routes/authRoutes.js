const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { registerSchema, loginSchema, validate } = require('../validators/authValidators');

// POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// GET /api/auth/me  (ruta protegida - requiere JWT)
router.get('/me', protect, getMe);

module.exports = router;
