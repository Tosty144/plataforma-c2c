const app = require('../src/app');
const connectDB = require('../src/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: err.message });
  }
};