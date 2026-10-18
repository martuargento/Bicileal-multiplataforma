const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { v2: cloudinary } = require('cloudinary');

const mediaDir = path.join(__dirname, '../../media/bicicletas');

const configuracionCloudinary = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
const cloudinaryConfigurado = Object.values(configuracionCloudinary).every(Boolean);

if (cloudinaryConfigurado) {
  cloudinary.config({ ...configuracionCloudinary, secure: true });
}

async function guardarImagen(file) {
  if (!file?.buffer) {
    throw new Error('No se recibió una imagen válida.');
  }

  if (cloudinaryConfigurado) {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'bicileal/productos', resource_type: 'image' },
        (error, resultado) => {
          if (error) {
            return reject(error);
          }

          if (!resultado?.secure_url) {
            return reject(new Error('Cloudinary no devolvió la URL de la imagen.'));
          }

          return resolve(resultado.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }

  if (process.env.NODE_ENV === 'production') {
    const error = new Error('Falta configurar Cloudinary para guardar imágenes.');
    error.statusCode = 503;
    throw error;
  }

  await fs.promises.mkdir(mediaDir, { recursive: true });
  const extension = path.extname(file.originalname) || '.jpg';
  const nombreArchivo = `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
  await fs.promises.writeFile(path.join(mediaDir, nombreArchivo), file.buffer);

  return `/media/bicicletas/${nombreArchivo}`;
}

module.exports = { mediaDir, guardarImagen };
