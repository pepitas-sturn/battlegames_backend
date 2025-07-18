
import catchAsync from "@/Utils/helper/catchAsync";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { ESessionType } from "../../auth.types";
import { AuthServices } from "../../services";
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const resendOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId, sessionType } = z.object({
        sessionId: z.string(),
        sessionType: z.nativeEnum(ESessionType),
    }).parse(req.body);
    const data = await AuthServices.resendOtp({
        sessionId,
        sessionType
    });
    sendResponse.success(res, {
        statusCode: 200,
        message: "Otp resent successfully",
        data
    });
}); 