const TYPES = require('./output-types.json');

const FileWriter = require('./FileWriter');
const DBWriter = require('./DBWriter');
const ConsoleWriter = require('./ConsoleWriter');
const QueueWriter = require('./QueueWriter');

// Factory method

const constructors = {
  [TYPES.FILE]: () => new FileWriter(),
  [TYPES.DB]: () => new DBWriter(),
  [TYPES.QUEUE]: () => new QueueWriter(),
  [TYPES.NULL]: () => null,
  [TYPES.CONSOLE]: () => new ConsoleWriter(),
};

class Factory {
  create (type) {
    return (constructors[type] || constructors.CONSOLE)();
  }
}

module.exports = Factory;
