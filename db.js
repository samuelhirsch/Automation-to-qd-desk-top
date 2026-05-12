import mysql from 'mysql2/promise';

// Create connection pool
const db = await mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

// Verify connectivity
await db.query('SELECT 1');
console.log('✅ MySQL connected');

// Create table
await db.execute(`
  CREATE TABLE IF NOT EXISTS synced_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spend_date DATE UNIQUE,
    amount DECIMAL(10,2),
    qb_synced TINYINT(1) NOT NULL DEFAULT 0,
    qb_txn_id VARCHAR(255) DEFAULT NULL,
    synced_at DATETIME DEFAULT NULL
  )
`);

console.log('✅ Table ready');

export default db;