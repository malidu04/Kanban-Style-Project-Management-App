const express = a=>require('express');
const router = express.Router();
const { registerUser, loginUser } = a=>require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;