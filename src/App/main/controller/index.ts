import CustomError from "@/Utils/errors/customError.class"
import catchAsync from "@/Utils/helper/catchAsync"
import { queryOptimization } from "@/Utils/helper/queryOptimize"
import { sendResponse } from "@/Utils/helper/sendResponse"
import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { Services } from "../services"
import { TGameState } from "../types"
import { Validations } from "../validations"

const getAllRooms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data = await Services.getAllRooms()

    sendResponse.success(res, {
        message: 'All rooms fetched successfully',
        statusCode: 200,
        data
    })
})

const getSingleRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = z.object({
        id: z.string().min(1)
    }).parse(req.params)

    const data = await Services.getSingleRoom(id)

    sendResponse.success(res, {
        message: 'Room fetched successfully',
        statusCode: 200,
        data
    })
})

const createRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = Validations.GameStatePayloadSchema.parse({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
    })

    const data = await Services.createRoom(payload)

    sendResponse.success(res, {
        message: 'Created successfully',
        statusCode: 200,
        data
    })
}
)

const updateRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = z.object({
        id: z.string().min(1)
    }).parse(req.params)

    const room = await Services.getSingleRoom(id)


    if (!room) {
        throw new CustomError('Room not found', 404)
    }

    const payload = Validations.GameStatePayloadSchema.parse({
        _id: id,
        ...req.body,
        createdAt: new Date(room.createdAt),
        updatedAt: new Date(),
    })

    await Services.updateRoom(id, payload)

    sendResponse.success(res, {
        message: 'Room updated successfully',
        statusCode: 200
    })
})

const deleteRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = z.object({
        id: z.string().min(1)
    }).parse(req.params)

    await Services.deleteRoom(id)

    sendResponse.success(res, {
        message: 'Room deleted successfully',
        statusCode: 200
    })
})

const getHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = queryOptimization<TGameState>(req, [])

    const data = await Services.getHistory(payload)

    sendResponse.success(res, {
        message: 'History fetched successfully',
        statusCode: 200,
        data
    })
})

export const Controller = {
    getAllRooms,
    getSingleRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    getHistory
}