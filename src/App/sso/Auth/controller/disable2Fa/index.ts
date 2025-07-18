import catchAsync from "@/Utils/helper/catchAsync";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { NextFunction, Request, Response } from 'express';
import { AuthValidation } from "../../auth.validation";
import { AuthServices } from "../../services";

export const disable2Fa = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { _id, otp } = AuthValidation.disable2FaZodSchema.parse({
        _id: req.headers._id,
        otp: req.body.otp
    });
    const data = await AuthServices.disable2Fa(_id.toString(), otp);
    sendResponse.success(res, {
        statusCode: 200,
        message: "2FA disabled successfully",
    });
}); 