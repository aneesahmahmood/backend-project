const { Pool } = require("pg");

// handle using the correct environment variables here
const ENV = process.env.NODE_ENV || "development";
const pathToENVFile = `${__dirname}/../.env.${ENV}`;

require("dotenv").config({ path: pathToENVFile });

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
}


module.exports = new Pool();