const User = require('../models/User');
const Bookmark = require('../models/Bookmark');

// @desc    Obtener todos los usuarios
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map((u) => u.toPublic()),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cambiar rol de un usuario (admin <-> user)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const changeUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    // No permitir que el admin se quite su propio rol
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'No puedes cambiar tu propio rol.' });
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      message: `Rol cambiado a '${user.role}' exitosamente.`,
      data: user.toPublic(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar un usuario y sus bookmarks
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'No puedes eliminarte a ti mismo.' });
    }

    await Bookmark.deleteMany({ user: user._id });
    await user.deleteOne();

    res.status(200).json({ success: true, message: 'Usuario y sus bookmarks eliminados.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todos los bookmarks (todos los usuarios)
// @route   GET /api/admin/bookmarks
// @access  Private/Admin
const getAllBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, changeUserRole, deleteUser, getAllBookmarks };
