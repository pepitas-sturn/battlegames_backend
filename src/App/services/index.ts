import CustomError from "@/Utils/errors/customError.class"
import { calculatePagination, manageSorting } from "@/Utils/helper/queryOptimize"
import { IQueryItems } from "@/Utils/types/query.type"
import GameStateModel from "../model"
import { RedisService } from "../redisServices"
import { SocketService } from "../sockerService"
import { TGameState } from "../types"

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

//get history
const getHistory = async (payload: IQueryItems<TGameState>) => {
    const { page, limit, skip } = calculatePagination(payload.paginationFields)
    const { sortOrder, sortBy } = manageSorting(payload.sortFields)

    const history = await GameStateModel.find({})
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)

    const total = await GameStateModel.countDocuments()

    return {
        data: history,
        meta: {
            page,
            limit,
            total,
        }
    }
}

//create room
const createRoom = async (room: TGameState) => {

    const existingRoom = await GameStateModel.findOne({ validatorKey: room.validatorKey })

    if (existingRoom) throw new CustomError('Validator key already exists.', 400)

    const createPayload = {
        validatorKey: room.validatorKey,
        participants: room.participants,
        gameWinner: null,
    }
    const data = await GameStateModel.create(createPayload)

    const roomId = data._id.toString() //the db id is the room id

    // const roomExists = await getSingleRoom(roomId)

    // if (roomExists) throw new CustomError('Room Id already exists.', 400)

    const newRoom = await RedisService.createRoom(roomId, { ...room, roomId })

    if (!newRoom) throw new CustomError('Room created failed.', 400)

    SocketService.updateRoomList()

    return {
        ...room,
        roomId,
    }
}

//update room
const updateRoom = async (roomId: string, room: TGameState) => {
    //db logic
    const gameState = await GameStateModel.findOne({ _id: roomId })

    if (!gameState) throw new CustomError('Room not found.', 404)

    // const roomId = gameState._id.toString()

    if (room.gameWinner) {
        const updatePayload = {
            gameWinner: room.gameWinner,
        }
        await GameStateModel.updateOne({ _id: roomId }, { $set: updatePayload })
    }

    // const roomExists = await getSingleRoom(roomId)

    // if (!roomExists) throw new CustomError('Room not found.', 404)

    const updatedRoom = await RedisService.updateRoom(roomId, room)

    if (!updatedRoom) throw new CustomError('Room updated failed.', 400)

    SocketService.updateGameState(roomId, room)
    SocketService.updateRoomList()

    return updatedRoom
}

//delete room
const deleteRoom = async (roomId: string) => {
    const gameState = await GameStateModel.findOne({ _id: roomId })

    if (!gameState) throw new CustomError('Room not found.', 404)

    await GameStateModel.deleteOne({ _id: roomId })

    // const roomId = gameState._id.toString()

    // const roomExists = await getSingleRoom(roomId)

    // if (!roomExists) throw new CustomError('Room not found.', 404)

    const deletedRoom = await RedisService.deleteRoom(roomId)

    if (!deletedRoom) throw new CustomError('Room deleted failed.', 400)

    SocketService.updateRoomList()

    return deletedRoom
}

export const Services = {
    getAllRooms,
    getSingleRoom,
    getHistory,
    createRoom,
    updateRoom,
    deleteRoom,
}