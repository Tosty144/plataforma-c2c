const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Conexión segura usando ÚNICAMENTE la variable de entorno de Vercel
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: La variable de entorno MONGO_URI no está definida.');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado con éxito a MongoDB Atlas'))
    .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));
}

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;