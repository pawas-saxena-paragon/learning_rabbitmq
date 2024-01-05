import amqplib from "amqplib";
import { v4 } from "uuid";
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

        channel.publish("", REQUEST_QUEUE, Buffer.from("Alan Turing"), {
          correlationId: v4(),
          replyTo: RESPONSE_QUEUE,
        });

        channel.consume(RESPONSE_QUEUE, (msg: amqplib.ConsumeMessage) => {
          console.log(
            `client recieved ${RESPONSE_QUEUE}: ${msg.properties.correlationId}`,
            msg?.content.toString()
          );

          channel.ack(msg);
        });
      } catch (err) {
        console.log("Client Err:", err);
      }
    },
    false
  );

  consumer();
})();
