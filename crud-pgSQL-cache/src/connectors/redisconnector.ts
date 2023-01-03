import { Tedis } from "tedis";
import dotenv from 'dotenv'

dotenv.config();
const host_redis=process.env.HOST_REDIS;
const port_redis=process.env.PORT_REDIS;

export const tedis = new Tedis({
    host: host_redis,
    port: port_redis
  });