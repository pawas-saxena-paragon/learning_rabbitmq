require("dotenv").config();
const amqplib = require("amqplib");

const LETTERBOX_QUEUE = "letterbox";
const PUB_SUB_EXCHANGE = "pubSub";
const ROUTING_EXCHANGE = "routing";
const BOTH_ROUTING_KEY = "both";
const ANALYTICS_ONLY_KEY = "analyticsonly";
const PAYMENTS_ONLY_KEY = "paymentsonly";

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

const composeConnection = async (fn, closeConnection) => {
  let conn;
  try {
    conn = await amqplib.connect(
      `amqp://${process.env.RMQ_USER_NAME}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`
    );
  } catch (err) {
    console.log("Connection Err:", err);
  }

  return async (...args) => {
    try {
      await fn(conn, ...args);
      if (closeConnection) {
        await conn.close();
      }
    } catch (err) {
      console.log("Exception at outerlevel", err);
    }
  };
};

module.exports = {
  getConnection,
  LETTERBOX_QUEUE,
  PUB_SUB_EXCHANGE,
  composeConnection,
  ROUTING_EXCHANGE,
  BOTH_ROUTING_KEY,
  ANALYTICS_ONLY_KEY,
  PAYMENTS_ONLY_KEY
};
