class FileWriter {
  consume ({voucher = '', timestamp = new Date()}) {
    return console.log(JSON.stringify({ voucher, timestamp }));
  }
}

module.exports = FileWriter;
