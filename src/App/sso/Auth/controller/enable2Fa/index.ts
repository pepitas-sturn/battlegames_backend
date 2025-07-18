
import catchAsync from "@/Utils/helper/catchAsync";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { AuthValidation } from "../../auth.validation";
import { AuthServices } from "../../services";
import { NextFunction, Request, Response } from 'express';

export const enable2Fa = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { _id, otp, sessionId } = AuthValidation.enable2FaZodSchema.parse({
        _id: req.headers._id,
        otp: req.body.otp,
        sessionId: req.cookies['2faSessionId'] ?? "willow_bayer54@yahoo.com"
    });
    const data = await AuthServices.enable2Fa(_id.toString(), otp, sessionId);
    res.clearCookie('2faSessionId');
    sendResponse.success(res, {
        statusCode: 200,
        message: "2FA enabled successfully",
    });
}); 