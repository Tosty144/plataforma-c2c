const productModel = require('../models/productModel');

exports.getProducts = (req, res) => {
  const products = productModel.getAll(req.query);
  res.json(products);
};

exports.createProduct = (req, res) => {
  const { title, description, price, category, imageUrl, sellerId } = req.body;
  if (!title || !price || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const newProduct = productModel.create({
    id: Date.now().toString(),
    title,
    description,
    price,
    category,
    imageUrl: imageUrl || 'https://via.placeholder.com/150',
    sellerId: sellerId || 'user-123',
    status: 'Disponible'
  });

  res.status(201).json(newProduct);
};