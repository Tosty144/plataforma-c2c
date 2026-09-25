const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// HU-02 y HU-03: Publicación, búsqueda y filtrado de productos
router.get('/', productController.getProducts);
router.post('/', productController.createProduct);

module.exports = router;