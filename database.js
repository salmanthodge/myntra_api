const mysql = require("mysql2");

//DB connection
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "myntradb",
});

module.exports = conn;
