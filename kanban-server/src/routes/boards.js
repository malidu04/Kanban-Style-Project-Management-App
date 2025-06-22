const express = require('express');
const router = express.Router();
const { createBoard, getUserBoards, getBoardById } = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBoard).get(protect, getUserBoards);
router.route('/:id').get(protect, getBoardById);

module.exports = router;