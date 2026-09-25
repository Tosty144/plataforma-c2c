const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// HU-04: Proceso de compra
router.post('/', orderController.createOrder);

module.exports = router;