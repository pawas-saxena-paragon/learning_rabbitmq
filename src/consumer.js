const amqplib = require("amqplib");

const consumer = async () => {
  try {
    const queueName = "letterbox";
    const conn = await amqplib.connect("amqp://guest:guest@localhost:5672");
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName);

    const result = await channel.consume(queueName, (msg) => {
      console.log("MSG", msg?.content.toString());
      channel.ack(msg);
    });

    // not closing the connection
  } catch (err) {
    console.log("Err:", err);
  }
};

consumer();
