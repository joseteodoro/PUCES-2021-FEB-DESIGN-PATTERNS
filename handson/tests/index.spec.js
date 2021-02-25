const TYPES = require('../src/output-types.json');
const Writer = require('../src/Ugly-Writer');
const uuid = require('uuid').v4;

describe('src/index suite', () => {
  describe(`consuming user's  vouchers`, () => {
    it('should be able to write on console', () => {
      const output = new Writer();
      return output.consume(uuid(), TYPES.CONSOLE);
    });
    it('should be able to write on queue', () => {
      const output = new Writer();
      return output.consume(uuid(), TYPES.QUEUE);
    });
    it('should be able to write on db', () => {
      const output = new Writer();
      return output.consume(uuid(), TYPES.DB);
    });
    it('should be able to write on file', () => {
      const output = new Writer();
      return output.consume(uuid(), TYPES.FILE);
    });
  });
});
