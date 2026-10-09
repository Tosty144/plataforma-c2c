const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.createOrder = async (req, res) => {
  try {
    const { productId, buyerId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (product.status === 'Vendido') {
      return res.status(400).json({ error: 'El producto ya ha sido vendido' });
    }

    const order = await Order.create({ productId, buyerId });
    product.status = 'Vendido';
    await product.save();

    res.status(201).json({ message: 'Compra realizada con éxito', order });
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar la orden' });
  }
};