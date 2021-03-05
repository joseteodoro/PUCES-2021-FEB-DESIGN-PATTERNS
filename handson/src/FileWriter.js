const fs = require('fs');

const DESTINATION = './already-used.json';

class FileWriter {
  consume ({voucher = '', timestamp = new Date()}) {
    let records = null;
    try {
      records = JSON.parse(fs.readFileSync(DESTINATION) || '[]');
    } catch (err) {
      records = [];
    }
    records.push({voucher, timestamp});
    return fs.writeFileSync(DESTINATION, JSON.stringify(records));
  }
}

module.exports = FileWriter;
