const TYPES = require('./output-types.json');
const Factory = require('./WriterFactory');

class HealtCheck {
  status () {
    const factory = new Factory();
    return factory.create(TYPES.CONSOLE).health() &&
      factory.create(TYPES.FILE).health() &&
      factory.create(TYPES.DB).health() &&
      factory.create(TYPES.QUEUE).health();
  }
}

module.exports = HealtCheck;
