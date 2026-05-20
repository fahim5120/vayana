const express = require('express');
const router = express.Router();
const { getLendings, createLending, updateLending, deleteLending } = require('../controllers/lendingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getLendings)
  .post(protect, createLending);

router.route('/:id')
  .put(protect, updateLending)
  .delete(protect, deleteLending);

module.exports = router;
