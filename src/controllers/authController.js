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
  return res.status(201).json({ 
    message: 'Usuario registrado con éxito', 
    token: 'jwt-token-demo-' + newUser.id, 
    user: newUser 
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Ingresa correo y contraseña' });
  }

  const user = userModel.findByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  return res.json({ 
    message: 'Inicio de sesión exitoso', 
    token: 'jwt-token-demo-' + user.id, 
    user 
  });
};