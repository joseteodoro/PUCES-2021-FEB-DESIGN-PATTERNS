const Factory = require('./WriterFactory');

class Writer {
  constructor (valid = []) {
    this.valid = valid;
  }

  consume (voucher, type) {
    if (!this.valid.includes(voucher)) {
      const msg = `Voucher ${voucher} doenst exists`;
      console.log(msg);
      return Promise.reject(new Error(msg));
    }
    const timestamp = new Date();
    const used = { voucher, timestamp };
    return new Factory().create(type).consume(used);
  }
}

module.exports = Writer;
