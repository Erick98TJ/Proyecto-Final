const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const pedidosRoutes = require('./routes/pedidosRoutes');
const authRoutes = require('./routes/authRoutes'); // 👈 nueva línea

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(' Bienvenido al backend de gestión de pedidos');
});

app.use('/api/pedidos', pedidosRoutes);
app.use('/api', authRoutes); // 👈 nueva línea

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
