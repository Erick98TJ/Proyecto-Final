const bcrypt = require('bcryptjs');
const pool = require('./db/connection'); // asegúrate de que esta ruta sea correcta

const crearUsuario = async () => {
  const nombre = 'Admin';
  const email = 'admin@correo.com';
  const password = await bcrypt.hash('123456', 10); // cambia si quieres otra clave

  await pool.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)',
    [nombre, email, password]
  );

  console.log('✅ Usuario creado');
};

crearUsuario();
