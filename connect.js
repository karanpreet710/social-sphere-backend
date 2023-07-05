const mysql = require("mysql2");
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:process.env.DB_PASS,
    database:"social"
})

module.exports = db;