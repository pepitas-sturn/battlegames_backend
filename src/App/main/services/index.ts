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
const getSingleRoom = async (id: string) => {
    const room = await RedisService.getSingleRoom(id)
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

    // const existingRoom = await GameStateModel.findOne({ validatorKey: room.validatorKey })

    // if (existingRoom) throw new CustomError('Validator key already exists.', 400)

    const existingRoom = await RedisService.getSingleRoomByValidatorKey(room.validatorKey)

    if (existingRoom) throw new CustomError('Validator key is using by another room.', 400)

    const createPayload = {
        validatorKey: room.validatorKey,
        participants: room.participants,
        gameWinner: null,
    }
    const data = await GameStateModel.create(createPayload)

    const id = data._id.toString() //the db id is the room id

    // const roomExists = await getSingleRoom(id)

    // if (roomExists) throw new CustomError('Room Id already exists.', 400)

    const newRoom = await RedisService.createRoom(id, { ...room, _id: id })

    if (!newRoom) throw new CustomError('Room created failed.', 400)

    SocketService.updateRoomList()

    return {
        ...room,
        id,
    }
}

//update room
const updateRoom = async (id: string, room: TGameState) => {
    //db logic
    const gameState = await GameStateModel.findOne({ _id: id })

    if (!gameState) throw new CustomError('Room not found.', 404)

    // const id = gameState._id.toString()

    if (room.gameWinner) {
        const updatePayload = {
            gameWinner: room.gameWinner,
        }
        await GameStateModel.updateOne({ _id: id }, { $set: updatePayload })
    }

    // const roomExists = await getSingleRoom(id)

    // if (!roomExists) throw new CustomError('Room not found.', 404)

    const updatedRoom = await RedisService.updateRoom(id, room)

    if (!updatedRoom) throw new CustomError('Room updated failed.', 400)

    SocketService.updateGameState(id, room)
    SocketService.updateRoomList()

    return updatedRoom
}

//delete room
const deleteRoom = async (id: string) => {
    const gameState = await GameStateModel.findOne({ _id: id })

    if (!gameState) throw new CustomError('Room not found.', 404)

    await GameStateModel.deleteOne({ _id: id })

    // const id = gameState._id.toString()

    // const roomExists = await getSingleRoom(id)

    // if (!roomExists) throw new CustomError('Room not found.', 404)

    const deletedRoom = await RedisService.deleteRoom(id)

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