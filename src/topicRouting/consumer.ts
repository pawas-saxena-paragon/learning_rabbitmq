import amqplib from "amqplib";

import {
  composeConnection,
  EXCHANGE_TYPE,
  handleMessage,
  TOPIC_EXCHANGE,
} from "../utils/connection";

(async () => {
  const customRoutingKey = process.argv[2];
  if (!customRoutingKey) {
    throw "specify routing key";
  }

  const consumer = await composeConnection(
    async (_conn: amqplib.Connection, channel: amqplib.Channel) => {
      try {
        await channel.assertExchange(TOPIC_EXCHANGE, EXCHANGE_TYPE.TOPIC);
        const { queue: randomQueueName } = await channel.assertQueue("", {
          exclusive: true,
        });

        await channel.bindQueue(
          randomQueueName,
          TOPIC_EXCHANGE,
          customRoutingKey
        );

        await channel.consume(
          randomQueueName,
          handleMessage(channel, customRoutingKey)
        );
      } catch (err) {
        console.log("Consumer Err", err);
      }
    },
    false
  );

  consumer();
})();
