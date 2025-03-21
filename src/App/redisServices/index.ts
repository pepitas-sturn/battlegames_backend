import { RedisClient } from "@/Config/redis"
import { TGameState } from "../types"

//get all room
const getAllRooms = async (): Promise<TGameState[]> => {
    const rooms = await RedisClient.get('room:*')
    return rooms ? JSON.parse(rooms) : []
}

//get single room
const getSingleRoom = async (roomId: string): Promise<TGameState | null> => {
    const room = await RedisClient.get(`room:${roomId}`)
    return room ? JSON.parse(room) : null
}

//create room
const createRoom = async (roomId: string, room: TGameState): Promise<boolean> => {
    const newRoom = await RedisClient.set(`room:${roomId}`, JSON.stringify(room))
    return newRoom === 'OK' ? true : false
}

//update room data
const updateRoom = async (roomId: string, room: TGameState): Promise<boolean> => {
    const roomExists = await RedisClient.get(`room:${roomId}`)
    if (!roomExists) {
        throw new Error('Room not found')
    }
    const updatedRoom = await RedisClient.set(`room:${roomId}`, JSON.stringify(room))
    return updatedRoom === 'OK' ? true : false
}

//delete room
const deleteRoom = async (roomId: string): Promise<boolean> => {
    const roomExists = await RedisClient.get(`room:${roomId}`)
    if (!roomExists) {
        throw new Error('Room not found')
    }
    const deletedRoom = await RedisClient.del(`room:${roomId}`)
    return deletedRoom === 1 ? true : false
}

export const RedisService = {
    getAllRooms,
    getSingleRoom,
    createRoom,
    updateRoom,
    deleteRoom,
}