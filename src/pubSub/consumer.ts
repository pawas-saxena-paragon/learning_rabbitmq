import amqplib from "amqplib";

import {
  composeConnection,
  EXCHANGE_TYPE,
  handleMessage,
  PUB_SUB_EXCHANGE,
} from "../utils/connection";

(async () => {
  const consumer = await composeConnection(
    async (_conn: amqplib.Connection, channel: amqplib.Channel) => {
      try {
        await channel.assertExchange(PUB_SUB_EXCHANGE, EXCHANGE_TYPE.FANOUT);
        const { queue: randomQueueName } = await channel.assertQueue("", {
          exclusive: true,
        });

        await channel.bindQueue(randomQueueName, PUB_SUB_EXCHANGE, "");

        const result = await channel.consume(
          randomQueueName,
          handleMessage(channel)
        );

        // not closing the connection
      } catch (err) {
        console.log("Err:", err);
      }
    },
    false
  );

  consumer();
})();
