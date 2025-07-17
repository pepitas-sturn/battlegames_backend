import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { z } from "zod";
import { Services } from "./App/main/services";
export let socketServer: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null = null;
export let ioServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null = null;

export const activeSocketServer = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', (socket) => {
        socketServer = socket;
        ioServer = io;


        socket.on('joinInRoom', async (id: string) => {
            const _id = z.string().parse(id);
            const roomExists = await Services.getSingleRoom(_id);

            if (!roomExists) {
                io.emit('joinRoomResponse', { _id, message: 'Room not found' });
                return;
            }
            socket.join(_id);
            io.to(_id).emit('joinRoomResponse', { _id, message: 'Successfully joined in room' });
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