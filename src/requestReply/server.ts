import amqplib from "amqplib";

import {
  composeConnection,
  REQUEST_QUEUE,
  RESPONSE_QUEUE,
} from "../utils/connection";

(async () => {
  const consumer = await composeConnection(
    async (_conn: amqplib.Connection, channel: amqplib.Channel) => {
      try {
        await channel.assertQueue(REQUEST_QUEUE);
        await channel.assertQueue(RESPONSE_QUEUE);

        channel.consume(REQUEST_QUEUE, (msg: amqplib.ConsumeMessage) => {
          console.log(
            `server recieved ${REQUEST_QUEUE}: `,
            msg?.content.toString(), 
            msg.properties.correlationId
          );
          channel.publish(
            "",
            RESPONSE_QUEUE,
            Buffer.from(`ack for ${msg.properties.correlationId}`),
            {
              correlationId: msg.properties.correlationId,
            }
          );
          channel.ack(msg);
        });
      } catch (err) {
        console.log("Server Err:", err);
      }
    },
    false
  );

  consumer();
})();
