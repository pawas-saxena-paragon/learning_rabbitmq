const { getConnection, LETTERBOX_QUEUE } = require("../utils/connection");

const produce = async () => {
  try {
    const conn = await getConnection();
    const channel = await conn.createChannel();
    await channel.assertQueue(LETTERBOX_QUEUE);

    await channel.sendToQueue(
      LETTERBOX_QUEUE,
      Buffer.from("alan turing was a smart guy")
    );

    await channel.close();
    await conn.close();
  } catch (err) {
    console.log("Err:", err);
  }
};

produce();
