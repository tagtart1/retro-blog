require("dotenv").config();
const fs = require("fs");

const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
    // ca: fs.readFileSync("./global-bundle.pem").toString(),
  },
});

module.exports = pool;
