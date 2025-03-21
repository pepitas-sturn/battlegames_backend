import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";


export const activeSocketServer = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', (socket) => {
        console.log(`new user ${socket.id} joined.`);
        console.log(`{auth: ${socket.handshake.auth}}`);
        const { uid } = socket.handshake.auth;
        console.log(`{isConnected: ${socket.connected}}`);
        socket.connected && console.log(` user: ${socket.id} is connected.`);


        socket.on('message', (message: string) => {
            console.log(`{message: ${message}}`);
        })

        socket.on('PING', () => {
            socket.emit('PONG', 'Server is alive')
        })

        socket.on('disconnect', (reason) => {
            console.log(`user disconnected. Id ${socket.id}.  ${reason}`);
        })
    });

}