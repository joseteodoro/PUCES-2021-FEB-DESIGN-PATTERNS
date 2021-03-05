const amqp = require('amqplib');
const queue = 'design-patterns-frws';

class FileWriter {
  combine (address) {
    if (process.env.RABBIT_PORT) {
      return { ...address, port: process.env.RABBIT_PORT };
    }
    if (process.env.RABBIT_HOST) {
      return { ...address, hostname: process.env.RABBIT_HOST };
    }
    return address;
  }

  consume (entry) {
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
}

module.exports = FileWriter;
