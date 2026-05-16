const express = require('express');
const router = express.Router();
const { getAllUsers, changeUserRole, deleteUser, getAllBookmarks } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación Y rol admin
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);
router.get('/bookmarks', getAllBookmarks);

module.exports = router;
