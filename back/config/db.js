const mysql = require('mysql2/promise');

// Conexion con la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',         
  password: '',          
  database: 'biblioteca_digital'
});

module.exports = db;
