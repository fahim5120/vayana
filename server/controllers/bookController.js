const Book = require('../models/Book');

// @desc    Get all books for a user
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).populate('category', 'name');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  const { title, author, category, totalPages, currentPage, status, coverImage } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Please provide at least a title and author' });
  }

  try {
    const book = await Book.create({
      user: req.user._id,
      title,
      author,
      category,
      totalPages: totalPages || 1,
      currentPage: currentPage || 0,
      status: status || 'Not Started',
      coverImage: coverImage || '',
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'name');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBooks, createBook, getBookById, updateBook, deleteBook };
