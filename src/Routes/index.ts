import RoomRouter from "@/App/main/routes";
import AuthRoutes from "@/App/sso/Auth/auth.routes";
import AccountRouter from "@/App/sso/Account/account.routes";
import { Router } from "express";

const rootRouter = Router()

rootRouter
    .use(
        '/rooms',
        RoomRouter
    )
    .use(
        '/auth',
        AuthRoutes
    )
    .use(
        '/accounts',
        AccountRouter
    )

export default rootRouter