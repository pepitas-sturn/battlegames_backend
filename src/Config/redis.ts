import config from "@/Config/index";
import { Redis } from "ioredis";

const RedisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port || 6379,
    password: config.redis.password
})

// checking redis server connection
RedisClient.on("connect", () => {
    console.log("Client is connecting to Redis server");
    RedisClient.ping((err, result) => {
        if (err) {
            console.log("Redis Ping failed:", err);
        } else {
            console.log("Redis Ping response:", result);
        }
        // RedisClient.quit();
    });
});

RedisClient.on('ready', () => {
    console.log("Client successfully connected to Redis and ready to use");
})

RedisClient.on("error", (err) => {
    console.log("Redis error:", err);
});


export { RedisClient };
