const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Conexión a MongoDB usando la variable de entorno de Vercel (o fallback local/remoto)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://jvaronm_db_user:IjGnYYcnjfPyX0aI@marketsistemico.0xw0zdd.mongodb.net/marketjhos?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado con éxito a MongoDB Atlas'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;