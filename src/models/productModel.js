const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'otro' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  sellerId: { type: String, required: true },
  status: { type: String, default: 'Disponible' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);