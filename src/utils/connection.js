require("dotenv").config();
const amqplib = require("amqplib");

const LETTERBOX_QUEUE = "letterbox";
const PUB_SUB_EXCHANGE = "pubSub";

const getConnection = async () => {
  try {
    const conn = await amqplib.connect(
      `amqp://${process.env.RMQ_USER_NAME}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`
    );
    return conn;
  } catch (err) {
    console.log("Connection Err:", err);
  }
};

module.exports = { getConnection, LETTERBOX_QUEUE, PUB_SUB_EXCHANGE };
