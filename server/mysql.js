require("dotenv").config();
const mysql = require('mysql2/promise');

let db;

async function connectToDatabase() {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('Connected to MYSQL-Database');
  }

  return db;
}

connectToDatabase().catch(error => {
  console.log("error connecting to MYSQL-Database: " + error.stack);
});

module.exports = connectToDatabase;