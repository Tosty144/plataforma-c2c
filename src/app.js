const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // <-- antes era express.json() sin límite explícito

// Ruta base de prueba para la API
app.get('/api', (req, res) => {
  res.json({ message: 'API C2C activa y funcionando en Vercel' });
});

// Rutas modulares
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;