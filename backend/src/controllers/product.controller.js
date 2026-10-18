const { prisma } = require('../lib/prisma');
const { guardarImagen } = require('../data/storage');


function serializeProducto(producto) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    precio: Number(producto.precio).toFixed(2),
    stock: Number(producto.stock),
    imagen: producto.imagen || null,
    creado_en: producto.creado_en,
  };
}


async function listaDeProductos(req, res) {  
  const productos = await prisma.producto.findMany({
    orderBy: { id: 'desc' },
  });

  return res.json(productos.map(serializeProducto));
}


async function crearProducto(req, res) {
  const nombre = String(req.body.nombre || '').trim();
  const descripcion = String(req.body.descripcion || '');
  const precio = Number(req.body.precio || 0);
  const stock = Number(req.body.stock || 0);


  if (!nombre) {
    return res.status(400).json({
      error: 'Datos inválidos.',
      details: { nombre: ['El nombre es obligatorio.'] },
    });
  }

  if (precio < 0) {
    return res.status(400).json({
      error: 'Datos inválidos.',
      details: { precio: ['El precio no puede ser negativo.'] },
    });
  }

  if (stock < 0) {
    return res.status(400).json({
      error: 'Datos inválidos.',
      details: { stock: ['El stock no puede ser negativo.'] },
    });
  }


  let imagen = null;
  if (req.file) {
    try {
      imagen = process.env.NODE_ENV === 'production'
        ? await guardarImagen(req.file)
        : `/media/bicicletas/${req.file.filename}`;
    } catch (error) {
      console.error('No se pudo guardar la imagen del producto:', error);
      return res.status(error.statusCode || 502).json({
        error: 'No se pudo guardar la imagen del producto.',
      });
    }
  }

  const producto = await prisma.producto.create({
    data: {
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      imagen,
    },
  });

  return res.status(201).json(serializeProducto(producto));
}



async function actualizarProducto(req, res) {

  const productoExistente = await prisma.producto.findUnique({
    where: { id: Number(req.params.id) },
  });


  if (!productoExistente) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }


  const nombre = req.body.nombre !== undefined ? String(req.body.nombre).trim() : productoExistente.nombre;
  const descripcion = req.body.descripcion !== undefined ? String(req.body.descripcion || '') : productoExistente.descripcion;
  const precio = req.body.precio !== undefined ? Number(req.body.precio) : Number(productoExistente.precio);
  const stock = req.body.stock !== undefined ? Number(req.body.stock) : Number(productoExistente.stock);


  if (!nombre) {
    return res.status(400).json({
      error: 'Datos inválidos.',
      details: { nombre: ['El nombre es obligatorio.'] },
    });
  }


  if (precio < 0) {
    return res.status(400).json({
      error: 'Datos inválidos.',
      details: { precio: ['El precio no puede ser negativo.'] },
    });
  }


  if (stock < 0) {
    return res.status(400).json({
      error: 'Datos inválidos.',
      details: { stock: ['El stock no puede ser negativo.'] },
    });
  }


  let imagen = productoExistente.imagen;
  if (req.file) {
    try {
      imagen = process.env.NODE_ENV === 'production'
        ? await guardarImagen(req.file)
        : `/media/bicicletas/${req.file.filename}`;
    } catch (error) {
      console.error('No se pudo guardar la imagen del producto:', error);
      return res.status(error.statusCode || 502).json({
        error: 'No se pudo guardar la imagen del producto.',
      });
    }
  }

  const producto = await prisma.producto.update({
    where: { id: Number(req.params.id) },
    data: {
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      imagen,
    },
  });

  return res.json(serializeProducto(producto));
}


async function borrarProducto(req, res) {
  const productoExistente = await prisma.producto.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!productoExistente) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  await prisma.producto.delete({
    where: { id: Number(req.params.id) },
  });

  return res.status(200).json({ mensaje: 'Producto eliminado.' });
}

async function listaDePedidos(req, res) {

  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId: req.user.id },
    orderBy: { id: 'desc' },
    
  });


  return res.json(pedidos.map((pedido) => ({
    id: pedido.id,
    usuario: pedido.usuarioId,
    total: Number(pedido.total).toFixed(2),
    creado_en: pedido.creado_en,
  })));
}

async function crearPedido(req, res) {

  const total = Number(req.body.total || 0);

  if (total < 0) {
    return res.status(400).json({ error: 'El total no puede ser negativo.' });
  }

  const pedido = await prisma.pedido.create({
    data: {
      usuarioId: req.user.id,
      total: Number(total),
    },
  });

  return res.status(201).json({
    id: pedido.id,
    usuario: pedido.usuarioId,
    total: Number(pedido.total).toFixed(2),
    creado_en: pedido.creado_en,
  });
}


module.exports = {
  listaDeProductos,
  crearProducto,
  actualizarProducto,
  borrarProducto,
  listaDePedidos,
  crearPedido,
  serializeProducto,
};
