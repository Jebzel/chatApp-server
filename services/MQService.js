const amqp = require('amqplib/callback_api');
const CONN_URL = 'amqp://vutexvto:QVaV_aZCD8vOudr-9MypMDkuw4jZvnav@jellyfish.rmq.cloudamqp.com/vutexvto';

class MQService {
   constructor() {}
   publishToQueue(queueName, _msg, callback) {
      amqp.connect(CONN_URL, function (error0, connection) {
         if (error0) {
            throw error0;
         }
         connection.createChannel(function (error1, channel) {
            if (error1) {
               throw error1;
            }
            var queue = queueName;
            var msg = _msg;

            channel.assertQueue(queue, {
               durable: true
            });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, function (msg) {
               console.log(" [x] Received %s", msg.content.toString());
               connection.close();
               callback(true);
               // process.exit(0)
            }, {
               noAck: true
            });
         });
      });
   }
}
module.exports = MQService;