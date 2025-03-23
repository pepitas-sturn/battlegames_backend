import { ioServer, socketServer } from "@/socketServer"
import { TGameState } from "../types"

const updateGameState = (roomId: string, gameState: TGameState) => {
    ioServer?.to(roomId).emit('gameStateUpdated', { gameState })
}
/* 
    in frontend:
    socket.on('gameStateUpdated', (data: TGameState) => {
        console.log(`{gameState: ${data}}`);
    })
*/

//join in room
const joinInRoom = (roomId: string) => {
    socketServer?.join(roomId)
}

export const SocketService = {
    joinInRoom,
    updateGameState
}