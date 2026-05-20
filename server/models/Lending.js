const mongoose = require('mongoose');

const lendingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book',
  },
  borrowerName: {
    type: String,
    required: true,
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  returned: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  }
}, {
  timestamps: true,
});

const Lending = mongoose.model('Lending', lendingSchema);

module.exports = Lending;
