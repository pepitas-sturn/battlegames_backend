
import Config from "@/Config";
import catchAsync from "@/Utils/helper/catchAsync";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { NextFunction, Request, Response } from 'express';
import { AuthValidation } from "../../auth.validation";
import { AuthServices } from "../../services";

export const generate2FaSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = AuthValidation.generate2FaSessionZodSchema.parse({
        _id: req.headers._id
    });
    const data = await AuthServices.generate2FaSession(_id);
    res.cookie('2faSessionId', data.sessionId, {
        httpOnly: true,
        secure: Config.node_env === 'prod',
        maxAge: 2 * 60 * 1000,
        sameSite: 'strict',
        path: '/',
    });
    const { qrCode, key } = data;
    sendResponse.success(res, {
        statusCode: 200,
        message: "2FA session generated successfully",
        data: {
            qrCode,
            key,
        }
    });
}); 