/* 
    node application root file
*/

import app from "@/app";
import config from "@/Config";
import "@/Config/db";
import '@/Config/redis';
import '@/Config/redis.events';
import http from "http";

const server = http.createServer(app)

//socket server
//58265 , 6463 , 52473
// const io = new Server(server, {
//     connectionStateRecovery: {
//         maxDisconnectionDuration: 10000
//     },
//     cors: {
//         origin: [
//             'http://localhost:3000',
//         ]
//     }
// });
// io.use((socket, next) => {
//     try {
//         const token = z.string({
//             required_error: 'Authorization token required'
//         }).parse(socket.handshake.auth.token)

//         // const { uid, role, email } = jwt.verify(token, config.jwt.refreshToken.secret as string) as CustomJwtPayload

//         // socket.handshake.auth = {
//         //     uid,
//         //     role,
//         //     email
//         // }
//         // if (!token) {
//         //     next(new CustomError('Authorization failed. ', 401))
//         // }
//         next()
//     } catch (e) {
//         next(new CustomError((e as Error).message as string, 500))
//     }
// })
// activeSocketServer(io)

const { port } = config

const main = async () => {
    try {
        server.listen(port, () => {
            console.log(`Server is listening on ${port}. Url: http://localhost:${port}`);
        })
    } catch (e) {
        console.log((e as Error).message);
    }
}

main()




//handle unHandleRejection errors
// For many types of unhandled rejections, it's not always necessary or advisable to close the server.
process.on('unhandledRejection', (err) => {
    // systemErrorLogger(err)
    console.log('unhandledRejection =>', err);
    // setTimeout(() => {
    //     if (server) {
    //         server.close(() => {
    //             process.exit(1)
    //         })
    //     } else {
    //         process.exit(1)
    //     }
    // }, 5000);
})

//handle unCaught exceptions
process.on('uncaughtException', (err) => {
    // systemErrorLogger(err)
    console.log('unhandledException =>', err);
    setTimeout(() => {
        if (server) {
            server.close(() => {
                process.exit(1)
            })
        }
    }, 5000);
})

// sigterm errors
process.on('SIGTERM', () => {
    const logMessage = 'SIGTERM signal received for graceful shutdown';
    // systemErrorLogger(logMessage); // Pass a message instead of an error
    console.log(logMessage);

    setTimeout(() => {
        if (server) {
            server.close(() => {
                console.log('HTTP server closed, exiting process');
                process.exit(0);
            });
        } else {
            console.log('No server instance, exiting process');
            process.exit(0);
        }
    }, 5000);
});