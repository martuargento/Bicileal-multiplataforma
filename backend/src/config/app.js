const express = require('express');
const cors = require('cors'); 
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('../routes/auth.routes');
const productRoutes = require('../routes/products.routes');

const app = express();
const originsPermitidos = (process.env.CORS_ORIGINS || [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.0.103:5173',
].join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || originsPermitidos.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origen no permitido por CORS.');
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/media', express.static(path.join(__dirname, '../../media')));

app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
  console.error('Error en solicitud API:', error);

  if (res.headersSent) {
    return next(error);
  }

  const status = error.statusCode
    || (error.code === 'LIMIT_FILE_SIZE' ? 413 : 500);
  const mensaje = status === 500
    ? 'Error interno del servidor.'
    : error.message;

  return res.status(status).json({ error: mensaje });
});

module.exports = app;
