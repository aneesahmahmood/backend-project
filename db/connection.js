const { config } = require('dotenv');
const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

const poolConfig = {};

if (ENV === 'production') {
  poolConfig.connectionString = process.env.DATABASE_URL;
  poolConfig.max = 2;
}

module.exports = new Pool(poolConfig);