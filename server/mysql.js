require("dotenv").config();
const mysql = require('mysql2/promise');

export default async function connectToDatabase() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  return db;
}

export async function query(sql, params=[]) {
  try {
    const db = await connectToDatabase();
    console.log('Connected to MYSQL-Database');
    const [results] = await db.execute(sql, params);
    await db.end()
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Rethrow the error after logging
  }
}