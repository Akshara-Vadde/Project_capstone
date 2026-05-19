// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login} = require('../controllers/authController');

router.post('/adduser', register);
router.post('/login', login);

module.exports = router;