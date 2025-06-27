const bcrypt = require('bcryptjs');
const pool = require('./db/connection'); 

const crearUsuario = async () => {
  const nombre = 'Admin';
  const email = 'admin@correo.com';
  const password = await bcrypt.hash('123456', 10); 

  await pool.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)',
    [nombre, email, password]
  );

  console.log(' Usuario creado');
};

crearUsuario();
