const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error('La variable MONGO_URI no está configurada en las variables de entorno.');
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB Atlas:', err);
    throw err;
  }
}

module.exports = connectDB;