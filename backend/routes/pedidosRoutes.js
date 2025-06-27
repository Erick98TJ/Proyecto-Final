const express = require('express');
const router = express.Router();
const pool = require('../db/connection');


router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY id ASC');
    console.log(' Datos obtenidos:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error(' Error al obtener pedidos:', error); 
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});



router.post('/', async (req, res) => {
  console.log(' Datos recibidos del formulario:', req.body);
  const { producto, cantidad, fecha_solicitada, fecha_entregada, estado } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO pedidos (producto, cantidad, fecha_solicitada, fecha_entregada, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [producto.trim(), cantidad, fecha_solicitada, fecha_entregada || null, estado.trim().toLowerCase()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(' Error al insertar pedido:', error.message);
    res.status(500).json({ error: 'Error al insertar pedido' });
  }
});


router.get('/indicadores', async (req, res) => {
  try {
    const tcpcQuery = `
      SELECT ROUND(COUNT(*) FILTER (WHERE estado = 'completo') * 100.0 / COUNT(*), 2) AS tcpc FROM pedidos
    `;
    const tpetQuery = `
      SELECT ROUND(
        COUNT(*) FILTER (
          WHERE fecha_entregada IS NOT NULL AND fecha_entregada <= fecha_solicitada
        ) * 100.0 / COUNT(*) FILTER (WHERE fecha_entregada IS NOT NULL), 2
      ) AS tpet FROM pedidos
    `;

    const tcpcResult = await pool.query(tcpcQuery);
    const tpetResult = await pool.query(tpetQuery);

    res.json({
      tcpc: tcpcResult.rows[0].tcpc,
      tpet: tpetResult.rows[0].tpet,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener indicadores' });
  }
});

module.exports = router;
