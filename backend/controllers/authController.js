const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { obtenerUsuarioPorEmail } = require('../models/usuariosModel');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre } });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
};

module.exports = { login };
