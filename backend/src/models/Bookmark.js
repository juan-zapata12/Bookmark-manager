const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'La URL es requerida'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      maxlength: [100, 'El título no puede superar 100 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'La descripción no puede superar 300 caracteres'],
      default: '',
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);
