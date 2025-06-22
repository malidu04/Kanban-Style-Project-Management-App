const express = require('express');
const router = express.Router();
const { createList, updateList, deleteList } = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');
const { validateList } = require('../middleware/validationMiddleware');

router.route('/')
    .post(protect, validateList, createList);

router.route('/:id')
    .put(protect, updateList)
    .delete(protect, deleteList);

module.exports = router;