const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');

exports.createOrder = (req, res) => {
  const { productId, buyerId } = req.body;
  const product = productModel.findById(productId);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  if (product.sellerId === buyerId) {
    return res.status(400).json({ error: 'El comprador no puede ser el mismo vendedor' });
  }

  if (product.status === 'Vendido') {
    return res.status(400).json({ error: 'El producto ya está vendido' });
  }

  // Registrar orden en orderModel
  const order = orderModel.create({
    productId,
    buyerId,
    amount: product.price
  });

  // Marcar producto como vendido
  productModel.updateStatus(productId, 'Vendido');

  return res.status(201).json({ message: 'Compra realizada con éxito', order });
};