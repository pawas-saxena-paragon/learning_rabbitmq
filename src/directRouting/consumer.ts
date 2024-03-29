import amqplib from "amqplib";

import {
  ROUTING_EXCHANGE,
  BOTH_ROUTING_KEY,
  composeConnection,
  handleMessage,
  EXCHANGE_TYPE,
} from "../utils/connection";

(async () => {
  const customRoutingKey = process.argv[2];
  if (!customRoutingKey) {
    throw "specify routing key";
  }

  const consumer = await composeConnection(
    async (_conn: amqplib.Connection, channel: amqplib.Channel) => {
      try {
        await channel.assertExchange(ROUTING_EXCHANGE, EXCHANGE_TYPE.DIRECT);
        const { queue: randomQueueName } = await channel.assertQueue("", {
          exclusive: true,
        });

        await channel.bindQueue(
          randomQueueName,
          ROUTING_EXCHANGE,
          customRoutingKey
        );
        await channel.bindQueue(
          randomQueueName,
          ROUTING_EXCHANGE,
          BOTH_ROUTING_KEY
        );

        await channel.consume(randomQueueName, handleMessage(channel, customRoutingKey));
      } catch (err) {
        console.log("Consumer Err", err);
      }
    },
    false
  );

  consumer();
})();
