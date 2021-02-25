const sqlite3 = require('sqlite3').verbose();

const DDL = `CREATE TABLE IF NOT EXISTS vouchers (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  voucher TEXT(1024),
  "timestamp" INTEGER);`

const setup = () => {
  const db = new sqlite3.Database('db.sqlite');
  db.run(DDL);
  db.close();
}

module.exports = { setup }
