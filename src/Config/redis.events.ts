import config from "@/Config/index";
import { Redis } from "ioredis";

const RedisEventClient = new Redis({
    host: config.redis.host,
    port: parseInt(config.redis.port as string) || 6379,
    password: config.redis.password
})

const chanel_name = '__keyevent@0__:expired'
RedisEventClient.config('SET', 'notify-keyspace-events', 'Ex');
RedisEventClient.subscribe('__keyevent@0__:expired');

RedisEventClient.on('message', async (channel: string, message: string) => {
    console.log('message', { message, channel });
    if (channel === chanel_name) {
        const id = message.split(':')
        if (id[0] === 'session') {
        }
    }
})