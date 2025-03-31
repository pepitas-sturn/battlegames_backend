import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { z } from "zod";
import { Services } from "./App/services";
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

        socket.on('joinInRoom', async (roomId: string) => {
            const id = z.string().parse(roomId);
            console.log(`{roomId: ${id}}`);
            const roomExists = await Services.getSingleRoom(id);

            if (!roomExists) {
                io.emit('joinRoomResponse', { roomId, message: 'Room not found' });
                return;
            }
            // SocketService.joinInRoom(id);
            socket.join(id);
            io.to(roomId).emit('joinRoomResponse', { roomId, message: 'Successfully joined in room' });
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