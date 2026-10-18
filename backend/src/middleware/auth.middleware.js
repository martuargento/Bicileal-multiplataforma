const { verificarToken } = require('../data/auth');
const { prisma } = require('../lib/prisma');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token requerido.' });
  }

  try {
    const tokenDecodificado = verificarToken(token);

    const user = await prisma.user.findUnique({
    where: { id: Number(tokenDecodificado.id) },
    select: {
      id: true,
      username: true,
      email: true,
      first_name: true,
      last_name: true,
    },
  });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no válido.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

module.exports = authMiddleware;
