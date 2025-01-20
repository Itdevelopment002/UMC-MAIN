const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "genicminds_kbmcDB",
    password: "Ys47U^!_d4QK",
    database: "genicminds_kbmcDB"
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

module.exports = db;
