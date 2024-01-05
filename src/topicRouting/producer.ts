import amqplib from "amqplib";

import {
  getConnection,
  ROUTING_EXCHANGE,
  composeConnection,
  TOPIC_EXCHANGE,
  EXCHANGE_TYPE,
} from "../utils/connection";

(async () => {
  const produce = await composeConnection(
    async (_conn: amqplib.Connection, channel: amqplib.Channel) => {
      const customRoutingKey = process.argv[2];
      if (!customRoutingKey) {
        throw "specify routing key";
      }

      try {
        await channel.assertExchange(TOPIC_EXCHANGE, EXCHANGE_TYPE.TOPIC);
        const message = "this message needs to be routed";
        channel.publish(TOPIC_EXCHANGE, customRoutingKey, Buffer.from(message));
        console.log("message sent");
      } catch (err) {
        console.log("Err:", err);
      }
    },
    true
  );

  produce();
})();
