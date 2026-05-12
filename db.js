import mysql from 'mysql2/promise';

// Create connection pool

const db = await mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
// Create table
await db.execute(`
  CREATE TABLE IF NOT EXISTS synced_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spend_date DATE UNIQUE,
    amount DECIMAL(10,2)
  )
`);

console.log('✅ Table ready');

export default db;