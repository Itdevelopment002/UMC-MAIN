const mysql = require('mysql');
require('dotenv').config();

// const db = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "Root@123",
//     // user: "root",
//     // password: "",
//     database: "genicminds_umc_latest_db"
// });

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "genicminds_newumcDb",
    password: "-LMR+2cO@dN(",
    // user: "root",
    // password: "",
    database: "genicminds_newumcDb"
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

module.exports = db;
