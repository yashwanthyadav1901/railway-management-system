const mysql = require("mysql2/promise");

const dbconfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

let db;

async function initializeDatabase() {
  try {
    db = await mysql.createConnection(dbconfig);
    console.log("Connected to the database");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

initializeDatabase();

module.exports = {
  getDb: () => db,
};
