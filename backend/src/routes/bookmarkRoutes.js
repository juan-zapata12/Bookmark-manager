const express = require('express');
const router = express.Router();
const {
  getBookmarks,
  createBookmark,
  updateBookmark,
  toggleFavorite,
  deleteBookmark,
} = require('../controllers/bookmarkController');
const { protect } = require('../middlewares/authMiddleware');
const { bookmarkSchema, validate } = require('../validators/bookmarkValidators');

router.use(protect);

router.route('/').get(getBookmarks).post(validate(bookmarkSchema), createBookmark);

router.route('/:id')
  .put(validate(bookmarkSchema), updateBookmark)
  .delete(deleteBookmark);

router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
