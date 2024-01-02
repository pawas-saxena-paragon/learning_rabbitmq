const amqplib = require("amqplib");

const produce = async () => {
  try {
    const queueName = "letterbox";
    const conn = await amqplib.connect("amqp://guest:guest@localhost:5672");
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName);

    await channel.sendToQueue(
      queueName,
      Buffer.from("alan turing was a smart guy")
    );

    await channel.close();
    await conn.close();
  } catch (err) {
    console.log("Err:", err);
  }
};

produce();
