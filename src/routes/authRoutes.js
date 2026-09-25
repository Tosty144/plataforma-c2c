const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// HU-01: Registro de usuarios
router.post('/register', authController.register);

module.exports = router;