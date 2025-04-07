/* 
    express application root file
*/

import globalErrorHandler from "@/Middlewares/Errors/globalErrorHandler";
import notFoundHandler from "@/Middlewares/Errors/notFoundHandler";
import cors from 'cors';
import express, { Application } from 'express';
import configRoutes from './Routes/config';

const app: Application = express()
app.use(express.json({}))
app.use(cors())

app.use(
    '/',
    configRoutes
)
app.use(globalErrorHandler)
app.use(notFoundHandler)

async function main() {
}

main()

export default app
