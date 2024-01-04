import amqplib from "amqplib";
import { config } from "dotenv";

config();

export const LETTERBOX_QUEUE = "letterbox";
export const PUB_SUB_EXCHANGE = "pubSub";
export const ROUTING_EXCHANGE = "routing";
export const BOTH_ROUTING_KEY = "both";
export const ANALYTICS_ONLY_KEY = "analyticsonly";
export const PAYMENTS_ONLY_KEY = "paymentsonly";

export const getConnection = async () => {
  try {
    const conn = await amqplib.connect(
      `amqp://${process.env.RMQ_USER_NAME}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`
    );
    return conn;
  } catch (err) {
    console.log("Connection Err:", err);
  }
};

export const composeConnection = async (fn, closeConnection) => {
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
