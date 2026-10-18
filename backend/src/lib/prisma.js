const esProduccion = process.env.NODE_ENV === 'production';
const clientePrisma = esProduccion
  ? require('../generated/prisma-production')
  : require('@prisma/client');
const { PrismaClient } = clientePrisma;

function configurarUrlPooler(url) {
  const databaseUrl = new URL(url);
  databaseUrl.searchParams.set('pgbouncer', 'true');
  return databaseUrl.toString();
}

const prisma = new PrismaClient(esProduccion
  ? {
    datasources: {
      db: { url: configurarUrlPooler(process.env.DATABASE_URL) },
    },
  }
  : undefined);

module.exports = { prisma };
