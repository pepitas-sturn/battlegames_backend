import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketService } from "./App/sockerService";
export let socketServer: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null = null;
export let ioServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null = null;

export const activeSocketServer = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', (socket) => {
        socketServer = socket;
        ioServer = io;


        console.log(`new user ${socket.id} joined.`);
        console.log(`{auth: ${socket.handshake.auth}}`);
        console.log(`{isConnected: ${socket.connected}}`);
        socket.connected && console.log(` user: ${socket.id} is connected.`);

        socket.on('joinInRoom', (roomId: string) => {
            SocketService.joinInRoom(roomId);
            socket.to(socket.id).emit('joinRoomResponse', { roomId, message: 'Successfully joined in room' });
        })

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