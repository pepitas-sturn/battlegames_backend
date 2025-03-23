import { config } from "dotenv";
import path from "path";

config({
    path: path.join(process.cwd(), ".env")
})

export default {
    port: process.env.PORT || 9000,
    node_env: process.env.NODE_ENV,
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },
    apiKey: process.env.API_KEY
}