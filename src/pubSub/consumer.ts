import { getConnection, PUB_SUB_EXCHANGE } from "../utils/connection";

const consumer = async () => {
  try {
    const conn = await getConnection();
    const channel = await conn.createChannel();

    await channel.assertExchange(PUB_SUB_EXCHANGE, "fanout");
    const { queue: randomQueueName } = await channel.assertQueue("", {
      exclusive: true,
    });

    await channel.bindQueue(randomQueueName, PUB_SUB_EXCHANGE, "");

    const result = await channel.consume(randomQueueName, (msg) => {
      console.log("MSG", msg?.content.toString());
      channel.ack(msg);
    });

    // not closing the connection
  } catch (err) {
    console.log("Err:", err);
  }
};

consumer();
