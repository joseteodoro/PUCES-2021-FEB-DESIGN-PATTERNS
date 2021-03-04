const TYPES = require('../src/output-types.json');
const Writer = require('../src/Ugly-Writer');
const valid = require('./unused.json');

describe('src/index suite', () => {
  describe(`consuming user's  vouchers`, () => {
    it('should be able to write on console', () => {
      const output = new Writer(valid);
      return output.consume('84b9cca3-08b2-4d39-aea1-a676804706ce', TYPES.CONSOLE);
    });
    it('should be able to write on queue', () => {
      const output = new Writer(valid);
      return output.consume('d09a50e0-2cde-4596-b5a3-9eeec06b0a39', TYPES.QUEUE);
    });
    it('should be able to write on db', () => {
      const output = new Writer(valid);
      return output.consume('0df96883-d0b3-43bd-94bb-bb63e682a85a', TYPES.DB);
    });
    it('should be able to write on file', () => {
      const output = new Writer(valid);
      return output.consume('a67cc617-82d8-4844-bd05-102e95369f9b', TYPES.FILE);
    });
    it('should be able to write on file', async () => {
      const output = new Writer(valid);
      await expect(output.consume('unexistent-token', TYPES.FILE)).to.eventually.be.rejected;
    });
  });
});
