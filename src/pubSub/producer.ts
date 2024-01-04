import { getConnection, PUB_SUB_EXCHANGE } from "../utils/connection";

const produce = async () => {
  try {
    const conn = await getConnection();
    const channel = await conn.createChannel();

    await channel.assertExchange(PUB_SUB_EXCHANGE, "fanout");

    channel.publish(PUB_SUB_EXCHANGE, "", Buffer.from("Alan makes bad jokes"));
    await channel.close();
    await conn.close();
  } catch (err) {
    console.log("Err:", err);
  }
};

produce();
