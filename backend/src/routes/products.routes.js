const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth.middleware');
const asyncHandler = require('../middleware/asyncHandler');

const {
  listaDeProductos,
  crearProducto,
  actualizarProducto,
  borrarProducto,
  listaDePedidos,
  crearPedido,
} = require('../controllers/product.controller');
const { mediaDir } = require('../data/storage');

const router = express.Router();
const almacenamientoImagen = process.env.NODE_ENV === 'production'
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination: (req, file, callback) => callback(null, mediaDir),
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname) || '.jpg';
      const nombreArchivo = `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
      callback(null, nombreArchivo);
    },
  });

const upload = multer({
  storage: almacenamientoImagen,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      const error = new Error('Solo se permiten archivos de imagen.');
      error.statusCode = 400;
      return callback(error);
    }

    return callback(null, true);
  },
});

router.get('/productos', asyncHandler(listaDeProductos));
router.post('/productos/crear', authMiddleware, upload.single('imagen'), asyncHandler(crearProducto));
router.patch('/productos/:id/actualizar', authMiddleware, upload.single('imagen'), asyncHandler(actualizarProducto));
router.delete('/productos/:id/eliminar', authMiddleware, asyncHandler(borrarProducto));
router.get('/pedidos', authMiddleware, asyncHandler(listaDePedidos));
router.post('/pedidos/crear', authMiddleware, asyncHandler(crearPedido));
router.get('/health', (req, res) => res.json({ ok: true, service: 'node_backend' }));

module.exports = router;
