const userModel = require('../models/userModel');

exports.register = (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse' });
  }
  
  if (userModel.findByEmail(email)) {
    return res.status(400).json({ error: 'El correo ya está registrado' });
  }

  const newUser = userModel.create({ id: Date.now().toString(), name, email, password, phone });
  return res.status(201).json({ message: 'Usuario registrado con éxito', token: 'jwt-token-demo', user: newUser });
};