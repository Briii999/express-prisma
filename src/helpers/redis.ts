import Redis from "ioredis";
const port = process.env.PORT_REDIS!;
export const redis = new Redis(port);
