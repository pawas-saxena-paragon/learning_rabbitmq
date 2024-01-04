import amqplib from "amqplib";

import { composeConnection, LETTERBOX_QUEUE } from "../utils/connection";

(async () => {
  const produce = await composeConnection(
    async (_conn: amqplib.Connection, channel: amqplib.Channel) => {
      try {
        await channel.assertQueue(LETTERBOX_QUEUE);

        await channel.sendToQueue(
          LETTERBOX_QUEUE,
          Buffer.from("alan turing was a smart guy")
        );
      } catch (err) {
        console.log("Producer Err:", err);
      }
    },
    true
  );

  produce();
})();
