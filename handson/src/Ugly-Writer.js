const amqp = require('amqplib');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const TYPES = require('./output-types.json');
require('./setup-db').setup();

const SQL = `INSERT INTO vouchers
(voucher, "timestamp")
VALUES(?, ?);`;

const DESTINATION = './already-used.json';
const queue = 'design-patterns-frws';

class Writer {
  append ({voucher = '', timestamp = new Date()}) {
    let records = null;
    try {
      records = require(DESTINATION);
    } catch (err) {
      records = [];
    }
    records.push({voucher, timestamp});
    return fs.writeFileSync(DESTINATION, JSON.stringify(records));
  }

  persist ({voucher = '', timestamp = new Date()}) {
    const db = new sqlite3.Database('db.sqlite');

    db.serialize(() => {
      const stmt = db.prepare(SQL);
      stmt.run(voucher, timestamp.valueOf());
      stmt.finalize();
    });

    db.close();
  }

  combine (address) {
    if (process.env.RABBIT_PORT) {
      return { ...address, port: process.env.RABBIT_PORT };
    }
    if (process.env.RABBIT_HOST) {
      return { ...address, hostname: process.env.RABBIT_HOST };
    }
    return address;
  }

  publish (entry) {
    const rabbitAddress = this.combine({hostname: '0.0.0.0', port: 5672});
    const open = amqp.connect(rabbitAddress);
    return open.then(conn => {
      return conn.createChannel();
    })
      .then(ch => {
        return ch.assertQueue(queue)
          .then(() => {
            return ch.sendToQueue(queue, Buffer.from(JSON.stringify(entry)));
          })
          .then(() => {
            return ch.close();
          });
      })
      .then(() => {
        console.log(`Sent to ${queue}`);
      })
      .catch(err => {
        console.log(`Error sending to ${queue}. ${err}`);
        return Promise.reject(err);
      });
  }

  consume (voucher, type) {
    const timestamp = new Date();
    switch (type) {
      case TYPES.FILE:
        return this.append({ voucher, timestamp });

      case TYPES.DB:
        return this.persist({ voucher, timestamp });

      case TYPES.QUEUE:
        return this.publish({ voucher, timestamp });

      case TYPES.NULL:
        // does nothing
        break;

      case TYPES.CONSOLE:
      default:
        return console.log(JSON.stringify({ voucher, timestamp }));
    }
  }
}

module.exports = Writer;
