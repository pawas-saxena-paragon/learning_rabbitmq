const {
  getConnection,
  ROUTING_EXCHANGE,
  BOTH_ROUTING_KEY,
  ANALYTICS_ONLY_KEY,
} = require("../utils/connection");

const consumer = async () => {
  const conn = await getConnection();
  const channel = await conn.createChannel();
  await channel.assertExchange(ROUTING_EXCHANGE, "direct");
  const { queue: randomQueueName } = await channel.assertQueue("", {
    exclusive: true,
  });

  await channel.bindQueue(
    randomQueueName,
    ROUTING_EXCHANGE,
    ANALYTICS_ONLY_KEY
  );
  await channel.bindQueue(randomQueueName, ROUTING_EXCHANGE, BOTH_ROUTING_KEY);

  await channel.consume(
    randomQueueName,
    (msg) => {
      console.log("mesasge in " + ANALYTICS_ONLY_KEY, msg?.content.toString());
    },
    { noAck: true }
  );
};

consumer();
