const User = require('../models/User');
const { generateToken } = require('../middlewares/authMiddleware');

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado.',
      });
    }

    // Crear usuario (password se hashea automáticamente en el modelo)
    const user = await User.create({ name, email, password });

    // Generar JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: {
        user: user.toPublic(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario (incluir password que está oculto por defecto)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    // Generar JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Sesión iniciada exitosamente.',
      data: {
        user: user.toPublic(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: { user: req.user.toPublic() },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
