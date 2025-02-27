const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "genicminds_newumcDb",
    password: "caDy3}d^%R#n",
    database: "genicminds_newumcDb"
});

// const db = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "umc_genicminds_UMCDB",
//     password: "6mHN4DfTL%Yw",
//     // user: "root",
//     // password: "",
//     database: "umc_genicminds_UMCDB"
// });

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

module.exports = db;
