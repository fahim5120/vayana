const Lending = require('../models/Lending');

// @desc    Get all lendings for a user
// @route   GET /api/lending
// @access  Private
const getLendings = async (req, res) => {
  try {
    const lendings = await Lending.find({ user: req.user._id }).populate('book');
    res.json(lendings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a lending record
// @route   POST /api/lending
// @access  Private
const createLending = async (req, res) => {
  const { book, borrowerName, returnDate, notes } = req.body;

  if (!book || !borrowerName) {
    return res.status(400).json({ message: 'Please provide book and borrower name' });
  }

  try {
    const lending = await Lending.create({
      user: req.user._id,
      book,
      borrowerName,
      returnDate,
      notes,
    });

    res.status(201).json(lending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a lending record (e.g. mark as returned)
// @route   PUT /api/lending/:id
// @access  Private
const updateLending = async (req, res) => {
  try {
    const lending = await Lending.findById(req.params.id);

    if (!lending) {
      return res.status(404).json({ message: 'Lending record not found' });
    }

    if (lending.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedLending = await Lending.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('book');

    res.json(updatedLending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lending record
// @route   DELETE /api/lending/:id
// @access  Private
const deleteLending = async (req, res) => {
  try {
    const lending = await Lending.findById(req.params.id);

    if (!lending) {
      return res.status(404).json({ message: 'Lending record not found' });
    }

    if (lending.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await lending.deleteOne();
    res.json({ message: 'Lending record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLendings, createLending, updateLending, deleteLending };
