const clientePrisma = process.env.NODE_ENV === 'production'
  ? require('../generated/prisma-production')
  : require('@prisma/client');
const { PrismaClient } = clientePrisma;

const prisma = new PrismaClient();

module.exports = { prisma };
