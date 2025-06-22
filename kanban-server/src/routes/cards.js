const express = require('express');
const router = express.Router();
const { createCard, getCardById, updateCard, deleteCard, moveCard } = require('../controllers/cardController');
const { protect } = require('../middleware/authMiddleware');
const { validateCard } = require('../middleware/validationMiddleware');

router.route('/')
    .post(protect, validateCard, createCard);

router.route('/:id')
    .get(protect, getCardById)
    .put(protect, updateCard)
    .delete(protect, deleteCard);

router.route('/:cardId/move').put(protect, moveCard);

module.exports = router;