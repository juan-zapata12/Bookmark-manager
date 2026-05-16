const Bookmark = require('../models/Bookmark');

// @desc    Obtener todos los bookmarks del usuario
// @route   GET /api/bookmarks
// @access  Private
const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear bookmark
// @route   POST /api/bookmarks
// @access  Private
const createBookmark = async (req, res, next) => {
  try {
    const { url, title, description } = req.body;
    const bookmark = await Bookmark.create({ url, title, description, user: req.user._id });
    res.status(201).json({ success: true, message: 'Bookmark creado exitosamente.', data: bookmark });
  } catch (error) {
    next(error);
  }
};

// @desc    Editar bookmark
// @route   PUT /api/bookmarks/:id
// @access  Private
const updateBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ success: false, message: 'Bookmark no encontrado.' });
    if (bookmark.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar este bookmark.' });

    const { url, title, description } = req.body;
    bookmark.url = url || bookmark.url;
    bookmark.title = title || bookmark.title;
    bookmark.description = description ?? bookmark.description;
    await bookmark.save();

    res.status(200).json({ success: true, message: 'Bookmark actualizado.', data: bookmark });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorito
// @route   PATCH /api/bookmarks/:id/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ success: false, message: 'Bookmark no encontrado.' });
    if (bookmark.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'No tienes permiso.' });

    bookmark.favorite = !bookmark.favorite;
    await bookmark.save();

    res.status(200).json({ success: true, data: bookmark });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
const deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ success: false, message: 'Bookmark no encontrado.' });
    if (bookmark.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este bookmark.' });

    await bookmark.deleteOne();
    res.status(200).json({ success: true, message: 'Bookmark eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBookmarks, createBookmark, updateBookmark, toggleFavorite, deleteBookmark };
