import { config } from "dotenv";
import path from "path";
import z from "zod";

config({
    path: path.join(process.cwd(), ".env")
})

const envConfig = z.object({
    app_name: z.string(),
    port: z.number().default(9000),
    node_env: z.string().default("development"),
    redis: z.object({
        host: z.string(),
        port: z.number().default(6379),
        password: z.string(),
    }),
    apiKey: z.string(),
    mongo_uri: z.string(),
    bcrypt_saltRounds: z.number(),
    jwt: z.object({
        accessToken: z.object({
            secret: z.string(),
            exp: z.string()
        }),
        refreshToken: z.object({
            secret: z.string(),
            exp: z.string()
        }),
    }),
    mail: z.object({
        resend_api_key: z.string()
    }),
    frontend: z.object({
        reset_page_url: z.string(),
        verify_page_url: z.string()
    }),
    google: z.object({
        client_id: z.string(),
        client_secret: z.string()
    }),
    backend_base_url: z.string(),
    socket_api_key: z.string()
}).parse({
    app_name: process.env.APP_NAME,
    port: process.env.PORT || 9000,
    node_env: process.env.NODE_ENV,
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        password: process.env.REDIS_PASSWORD,
    },
    apiKey: process.env.API_KEY,
    mongo_uri: process.env.MONGO_URI,
    bcrypt_saltRounds: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 12,
    jwt: {
        accessToken: {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            exp: process.env.JWT_ACCESS_TOKEN_EXPIRE_IN
        },
        refreshToken: {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            exp: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN
        },
    },
    mail: {
        resend_api_key: process.env.RESEND_API_KEY
    },
    frontend: {
        reset_page_url: process.env.FRONTEND_RESET_PAGE_URL,
        verify_page_url: process.env.FRONTEND_VERIFY_PAGE_URL
    },
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET
    },
    backend_base_url: process.env.BACKEND_BASE_URL,
    socket_api_key: process.env.SOCKET_API_KEY
})

export default envConfig

// export default {
//     port: process.env.PORT || 9000,
//     node_env: process.env.NODE_ENV,
//     redis: {
//         host: process.env.REDIS_HOST,
//         port: process.env.REDIS_PORT,
//         password: process.env.REDIS_PASSWORD,
//     },
//     apiKey: process.env.API_KEY,
//     mongo_uri: process.env.MONGO_URI,
//     bcrypt_saltRounds: process.env.BCRYPT_SALT_ROUNDS,
//     jwt: {
//         accessToken: {
//             secret: process.env.JWT_ACCESS_TOKEN_SECRET,
//             exp: process.env.JWT_ACCESS_TOKEN_EXPIRE_IN
//         },
//         refreshToken: {
//             secret: process.env.JWT_REFRESH_TOKEN_SECRET,
//             exp: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN
//         },
//         common: process.env.JWT_COMMON_SECRET
//     },
//     mail: {
//         resend_api_key: process.env.RESEND_API_KEY
//     },
//     frontend: {
//         reset_page_url: process.env.FRONTEND_RESET_PAGE_URL,
//         verify_page_url: process.env.FRONTEND_VERIFY_PAGE_URL
//     },
//     google: {
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET
//     },
//     backend_base_url: process.env.BACKEND_BASE_URL
// }