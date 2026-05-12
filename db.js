import mysql from 'mysql2/promise';

// Create connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // add your password if you have one
  database: 'quickbookstest'
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