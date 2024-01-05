import amqplib from "amqplib";

import { composeConnection, PUB_SUB_EXCHANGE } from "../utils/connection";

(async () => {
  const produce = await composeConnection(
    async (_conn: amqplib.Connection, channel: amqplib.Channel) => {
      try {
        await channel.assertExchange(PUB_SUB_EXCHANGE, "fanout");

        channel.publish(
          PUB_SUB_EXCHANGE,
          "",
          Buffer.from("Alan makes bad jokes")
        );
      } catch (err) {
        console.log("Err:", err);
      }
    },
    true
  );

  produce();
})();
