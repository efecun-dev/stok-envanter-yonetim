const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  user: "root",
  password: "",
  database: "invento_db",
  host: "localhost",
});

module.exports = pool;
