require("dotenv").config();

const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "retrodb",
  password: process.env.DBPASS,
  port: 5001,
});

module.exports = pool;
