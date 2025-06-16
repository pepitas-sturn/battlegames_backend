import catchAsync from "@/Utils/helper/catchAsync"
import { sendResponse } from "@/Utils/helper/sendResponse"
import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { Services } from "../services"
import { Validations } from "../validations"
import CustomError from "@/Utils/errors/customError.class"

const getAllRooms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data = await Services.getAllRooms()

    sendResponse.success(res, {
        message: 'All rooms fetched successfully',
        statusCode: 200,
        data
    })
})

const getSingleRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { roomId } = z.object({
        roomId: z.string().min(1)
    }).parse(req.params)

    const data = await Services.getSingleRoom(roomId)

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

    await Services.createRoom(payload)

    sendResponse.success(res, {
        message: 'Created successfully',
        statusCode: 200,
        data: {
            ...payload,
        }
    })
}
)

const updateRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = z.object({
        roomId: z.string().min(1)
    }).parse(req.params)

    const room = await Services.getSingleRoom(roomId)

    if (!room) {
        throw new CustomError('Room not found', 404)
    }

    const payload = Validations.GameStatePayloadSchema.parse({
        roomId,
        ...req.body,
        createdAt: new Date(room.createdAt),
        updatedAt: new Date(),
    })

    await Services.updateRoom(roomId, payload)

    sendResponse.success(res, {
        message: 'Room updated successfully',
        statusCode: 200
    })
})

const deleteRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = z.object({
        roomId: z.string().min(1)
    }).parse(req.params)

    await Services.deleteRoom(roomId)

    sendResponse.success(res, {
        message: 'Room deleted successfully',
        statusCode: 200
    })
})

export const Controller = {
    getAllRooms,
    getSingleRoom,
    createRoom,
    updateRoom,
    deleteRoom
}