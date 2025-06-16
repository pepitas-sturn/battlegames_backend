import rootRouter from "@/Routes/index";
import { Router } from 'express';

const configRoutes = Router()


configRoutes
    .use(
        '/api/v1',
        rootRouter
    )


export default configRoutes