const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1,
  },
  currentPage: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ['Not Started', 'Reading', 'Completed'],
    default: 'Not Started',
  },
  coverImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
