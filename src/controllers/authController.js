const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const newUser = await User.create({ name, email, password, phone: phone || '' });
    return res.status(201).json({ 
      message: 'Usuario registrado con éxito', 
      token: 'jwt-token-demo-' + newUser._id, 
      user: { id: newUser._id.toString(), name: newUser.name, email: newUser.email } 
    });
  } catch (err) {
    console.error('Error en register:', err);
    return res.status(500).json({ error: 'Error interno en el servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Ingresa correo y contraseña' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    return res.json({ 
      message: 'Inicio de sesión exitoso', 
      token: 'jwt-token-demo-' + user._id, 
      user: { id: user._id.toString(), name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ error: 'Error interno en el servidor' });
  }
};