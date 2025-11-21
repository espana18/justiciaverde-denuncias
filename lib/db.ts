import mysql from "mysql2/promise";

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "justicia_verde_v2",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
