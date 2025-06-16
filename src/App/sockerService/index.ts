import { ioServer, socketServer } from "@/socketServer"
import { TGameState } from "../types"
import { Services } from "../services"

const updateGameState = (id: string, gameState: TGameState) => {
    ioServer?.to(id).emit('gameStateUpdated', { gameState })
}
/* 
    in frontend:

    socket.emit('joinInRoom', id)

    socket.on('joinRoomResponse', (data: { id: string, message: string }) => {
        console.log(`{id: ${data.id}, message: ${data.message}}`);
    })

    socket.on('gameStateUpdated', (data: TGameState) => {
        console.log(`{gameState: ${data}}`);
    })
*/

//join in room
const joinInRoom = (id: string) => {
    socketServer?.join(id)
}

const updateRoomList = async () => {
    ioServer?.emit('updateRoomList', await Services.getAllRooms())
}

export const SocketService = {
    joinInRoom,
    updateGameState,
    updateRoomList,
}