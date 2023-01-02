import { Tedis } from "tedis";

export const tedis = new Tedis({
    host: "127.0.0.1",
    port: 6379
  });