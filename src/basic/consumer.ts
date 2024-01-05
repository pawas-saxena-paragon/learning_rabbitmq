import amqplib from "amqplib";  

import {
  composeConnection,
  handleMessage,
  LETTERBOX_QUEUE,
} from "../utils/connection";

(async () => {
  const consumer = await composeConnection(
    async (_conn: amqplib.Connection, channel: amqplib.Channel) => {
      try {
        await channel.assertQueue(LETTERBOX_QUEUE);
        await channel.consume(LETTERBOX_QUEUE, handleMessage(channel));
      } catch (err) {
        console.log("Err:", err);
      }
    },
    false
  );

  consumer();
})();

// (async () => {

// })();
