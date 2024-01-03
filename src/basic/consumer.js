const { getConnection, LETTERBOX_QUEUE } = require("../utils/connection");

const consumer = async () => {
  try {
    const conn = await getConnection();
    const channel = await conn.createChannel();
    await channel.assertQueue(LETTERBOX_QUEUE);

    const result = await channel.consume(LETTERBOX_QUEUE, (msg) => {
      console.log("MSG", msg?.content.toString());
      channel.ack(msg);
    });

    // not closing the connection
  } catch (err) {
    console.log("Err:", err);
  }
};

consumer();
