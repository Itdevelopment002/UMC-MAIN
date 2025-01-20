const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "genicminds_umcdb",
    password: "ijOQ{QK3P]fJ",
    database: "genicminds_umcdb"
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

module.exports = db;
