const bcrypt = require('bcryptjs');
const { prisma } = require('../lib/prisma');
const { generarToken } = require('../data/auth');

function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
  };
}

async function registro(req, res) {
  const username = String(req.body.username || '').trim();
  const email = String(req.body.email || '').trim();
  const password = String(req.body.password || '');

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Completa username, email y password.' });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    return res.status(400).json({ error: 'Ese usuario ya existe.' });
  }
  

  const hashedPassword = await bcrypt.hash(password, 10);


  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      first_name: '',
      last_name: '',
    },
  });

  const tokens = generarToken(newUser);

  return res.status(201).json({
    user: serializeUser(newUser),
    tokens,
  });
}


async function login(req, res) {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas.' });
  }

  const passwordOk = await bcrypt.compare(password, user.password);

  if (!passwordOk) {
    return res.status(401).json({ error: 'Credenciales inválidas.' });
  }

  const tokens = generarToken(user);

  return res.status(200).json({
    user: serializeUser(user),
    tokens,
  });
}


function perfil(req, res) {
  return res.json(serializeUser(req.user));
}

module.exports = {
  registro,
  login,
  perfil,
};
