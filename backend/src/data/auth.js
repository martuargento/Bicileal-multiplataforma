const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY
  || (process.env.NODE_ENV === 'production' ? '' : 'bicileal-node-secret-dev');

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY es obligatorio en producción.');
}

function generarToken(user) {
  const payload = { id: user.id, username: user.username, email: user.email };

  return {
    refresh: jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' }),
    access: jwt.sign(payload, SECRET_KEY, { expiresIn: '60m' }),
  };
}

function verificarToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = {
  SECRET_KEY,
  generarToken,
  verificarToken,
};
