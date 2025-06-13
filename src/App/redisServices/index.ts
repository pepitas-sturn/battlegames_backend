import { RedisClient } from "@/Config/redis";
import { TGameState } from "../types";

//get all room
const getAllRooms = async (): Promise<TGameState[]> => {
    const ids = await RedisClient.keys('room:*')
    let rooms: TGameState[] = [];

    for (const id of ids) {
        const idOnly = id.split(':')[1]
        if (idOnly) {
            const data = await getSingleRoom(idOnly)
            data && rooms.push(data)
        }
    }

    return rooms ?? []
}

//get single room
const getSingleRoom = async (id: string): Promise<TGameState | null> => {
    const room = await RedisClient.get(`room:${id}`)
    return room ? JSON.parse(room) : null
}

//create room
const createRoom = async (id: string, room: TGameState): Promise<boolean> => {
    const newRoom = await RedisClient.setex(`room:${id}`, 5 * 60, JSON.stringify(room))
    return newRoom === 'OK' ? true : false
}

//update room data
const updateRoom = async (id: string, room: TGameState): Promise<boolean> => {
    const roomExists = await RedisClient.get(`room:${id}`)
    if (!roomExists) {
        throw new Error('Room not found')
    }
    const updatedRoom = await RedisClient.setex(`room:${id}`, 5 * 60, JSON.stringify(room))
    return updatedRoom === 'OK' ? true : false
}

//delete room
const deleteRoom = async (id: string): Promise<boolean> => {
    const roomExists = await RedisClient.get(`room:${id}`)
    if (!roomExists) {
        throw new Error('Room not found')
    }
    const deletedRoom = await RedisClient.del(`room:${id}`)
    return deletedRoom === 1 ? true : false
}

export const RedisService = {
    getAllRooms,
    getSingleRoom,
    createRoom,
    updateRoom,
    deleteRoom,
}