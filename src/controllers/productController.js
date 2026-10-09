const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
  try {
    const { search, category, maxPrice } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    // Mapeamos _id a id para mantener compatibilidad con el frontend
    const formattedProducts = products.map(p => ({
      id: p._id.toString(),
      title: p.title,
      price: p.price,
      category: p.category,
      description: p.description,
      image: p.image,
      sellerId: p.sellerId,
      status: p.status
    }));

    res.json(formattedProducts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, price, category, description, image, sellerId } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: 'Título y precio son obligatorios' });
    }

    const newProduct = await Product.create({
      title,
      price: Number(price),
      category: category || 'otro',
      description: description || '',
      image: image || 'https://via.placeholder.com/300x200?text=MarketJhos',
      sellerId: sellerId || 'vendedor-anonimo'
    });

    res.status(201).json({ id: newProduct._id.toString(), ...newProduct._doc });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ id: updated._id.toString(), ...updated._doc });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente', id });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};