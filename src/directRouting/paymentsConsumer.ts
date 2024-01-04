import {
  getConnection,
  ROUTING_EXCHANGE,
  BOTH_ROUTING_KEY,
  PAYMENTS_ONLY_KEY,
} from "../utils/connection";

const consumer = async () => {
  const conn = await getConnection();
  const channel = await conn.createChannel();
  await channel.assertExchange(ROUTING_EXCHANGE, "direct");
  const { queue: randomQueueName } = await channel.assertQueue("", {
    exclusive: true,
  });

  await channel.bindQueue(randomQueueName, ROUTING_EXCHANGE, PAYMENTS_ONLY_KEY);
  await channel.bindQueue(randomQueueName, ROUTING_EXCHANGE, BOTH_ROUTING_KEY);

  await channel.consume(
    randomQueueName,
    (msg) => {
      console.log("mesasge in " + PAYMENTS_ONLY_KEY, msg?.content.toString());
    },
    { noAck: true }
  );
};

consumer();
