import { pickFunction } from "@/Utils/helper/pickFunction";
import { TCustomErrorResponse, TGenericSuccessMessages } from "@/Utils/types/response.type";
import { Request, Response } from "express";

const successResponse = <T, M>(res: Response, data: TGenericSuccessMessages<T, M>) => {
    const property = pickFunction(data, ["message", "data", "statusCode", "meta", "req"])
    const req = property.req as Request;
    delete property.req;

    const responsePayload = {
        success: true,
        ...property
        // message: data.message || null,
        // data: data.data,
        // meta: data?.meta || null
    }
    res.status(data.statusCode).json(responsePayload)
}

const errorResponse = (res: Response, data: TCustomErrorResponse) => {

    const property = pickFunction(data, ["errorMessages", "message", "statusCode", "stack", "req"])

    const req = property.req as Request;
    delete property.req;

    const responsePayload = {
        success: false,
        ...property
        // message: data.message,
        // errorMessages: data.errorMessages,
        // stack: data.stack,
        // statusCode: data.statusCode
    }
    res.status(data.statusCode).json(responsePayload)
}

export const sendResponse = {
    success: successResponse,
    error: errorResponse
}