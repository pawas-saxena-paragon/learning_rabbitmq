import {
  getConnection,
  ROUTING_EXCHANGE,
  BOTH_ROUTING_KEY,
  ANALYTICS_ONLY_KEY,
} from "../utils/connection";

const produce = async () => {
  const customRoutingKey = process.argv[2];
  if (!customRoutingKey) {
    throw "specify routing key";
  }

  try {
    const conn = await getConnection();
    const channel = await conn.createChannel();
    await channel.assertExchange(ROUTING_EXCHANGE, "direct");
    const message = "this message needs to be routed";
    channel.publish(ROUTING_EXCHANGE, customRoutingKey, Buffer.from(message));
    console.log("message sent");

    await channel.close();
    await conn.close();
  } catch (err) {
    console.log("Err:", err);
  }
};

produce();
