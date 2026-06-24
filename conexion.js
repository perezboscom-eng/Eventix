const mysql = require('mysql2/promise');

const poolMySQL = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'eventix_db',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = poolMySQL;