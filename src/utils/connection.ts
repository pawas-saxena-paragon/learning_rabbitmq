import amqplib from "amqplib";
import { config } from "dotenv";

config();

export const LETTERBOX_QUEUE = "letterbox";
export const PUB_SUB_EXCHANGE = "pubSub";
export const ROUTING_EXCHANGE = "routing";
export const BOTH_ROUTING_KEY = "both";
export const ANALYTICS_ONLY_KEY = "analyticsonly";
export const PAYMENTS_ONLY_KEY = "paymentsonly";
export const TOPIC_EXCHANGE = "topicexchange";

export enum EXCHANGE_TYPE {
  DIRECT = "direct",
  TOPIC = "topic",
  FANOUT = 'fanout'
}

export const getConnection = async (): Promise<amqplib.Connection> => {
  try {
    const conn = await amqplib.connect(
      `amqp://${process.env.RMQ_USER_NAME}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`
    );
    return conn;
  } catch (err) {
    console.log("Connection Err:", err);
  }
};

export const composeConnection = async (
  fn: (
    conn: amqplib.Connection,
    channel: amqplib.Channel,
    ...args: any[]
  ) => void,
  closeConnection: boolean
) => {
  let conn: amqplib.Connection;
  let channel: amqplib.Channel;
  try {
    conn = await amqplib.connect(
      `amqp://${process.env.RMQ_USER_NAME}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`
    );
    channel = await conn.createChannel();
  } catch (err) {
    console.log("Connection Err:", err);
  }

  return async (...args: any[]) => {
    try {
      await fn(conn, channel, ...args);
      if (closeConnection) {
        await channel.close();
        await conn.close();
      }
    } catch (err) {
      console.log("Exception at outerlevel", err);
    }
  };
};

export const handleMessage = (
  channel: amqplib.Channel,
  prefix: string = ""
) => {
  return (msg: amqplib.ConsumeMessage) => {
    console.log(prefix, msg?.content.toString());
    channel.ack(msg);
  };
};
