const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://jvaronm_db_user:IjGnYYcnjfPyX0aI@marketsistemico.0xw0zdd.mongodb.net/marketjhos?retryWrites=true&w=majority";

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB Atlas:', err);
    throw err;
  }
}

module.exports = connectDB;