import CustomError from "@/Utils/errors/customError.class"
import { RedisService } from "../redisServices"
import { SocketService } from "../sockerService"
import { TGameState } from "../types"
import { ioServer } from "@/socketServer"

//get all room
const getAllRooms = async () => {
    const rooms = await RedisService.getAllRooms()
    return rooms
}

//get single room
const getSingleRoom = async (roomId: string) => {
    const room = await RedisService.getSingleRoom(roomId)
    return room
}

//create room
const createRoom = async (room: TGameState) => {

    const roomExists = await getSingleRoom(room.roomId)

    if (roomExists) throw new CustomError('Room Id already exists.', 400)

    const newRoom = await RedisService.createRoom(room.roomId, room)

    if (!newRoom) throw new CustomError('Room created failed.', 400)

    SocketService.updateRoomList()

    return newRoom
}

//update room
const updateRoom = async (roomId: string, room: TGameState) => {

    const roomExists = await getSingleRoom(roomId)

    if (!roomExists) throw new CustomError('Room not found.', 404)

    const updatedRoom = await RedisService.updateRoom(roomId, room)

    if (!updatedRoom) throw new CustomError('Room updated failed.', 400)

    SocketService.updateGameState(roomId, room)

    return updatedRoom
}

//delete room
const deleteRoom = async (roomId: string) => {

    const roomExists = await getSingleRoom(roomId)

    if (!roomExists) throw new CustomError('Room not found.', 404)

    const deletedRoom = await RedisService.deleteRoom(roomId)

    if (!deletedRoom) throw new CustomError('Room deleted failed.', 400)

    return deletedRoom
}

export const Services = {
    getAllRooms,
    getSingleRoom,
    createRoom,
    updateRoom,
    deleteRoom,
}