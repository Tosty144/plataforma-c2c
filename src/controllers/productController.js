const productModel = require('../models/productModel');

exports.getProducts = (req, res) => {
  const products = productModel.getAll(req.query);
  res.json(products);
};

exports.createProduct = (req, res) => {
  const { title, price, category, description, image, sellerId } = req.body;
  if (!title || !price) {
    return res.status(400).json({ error: 'Título y precio son obligatorios' });
  }

  const newProduct = productModel.create({
    title,
    price: Number(price),
    category: category || 'General',
    description: description || '',
    image: image || 'https://via.placeholder.com/300x200?text=MarketJhos',
    sellerId: sellerId || 'vendedor-anonimo'
  });

  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const updated = productModel.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(updated);
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const deleted = productModel.delete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json({ message: 'Producto eliminado correctamente', id });
};