const sqlite3 = require('sqlite3').verbose();
require('./setup-db').setup();

const SQL = `INSERT INTO vouchers
(voucher, "timestamp")
VALUES(?, ?);`;

class DBWriter {
  consume ({voucher = '', timestamp = new Date()}) {
    const db = new sqlite3.Database('db.sqlite');

    db.serialize(() => {
      const stmt = db.prepare(SQL);
      stmt.run(voucher, timestamp.valueOf());
      stmt.finalize();
    });

    db.close();
  }
}

module.exports = DBWriter;
