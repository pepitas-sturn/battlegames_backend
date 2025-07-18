import catchAsync from "@/Utils/helper/catchAsync";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { AuthValidation } from "../../auth.validation";
import { AuthServices } from "../../services";
import { NextFunction, Request, Response } from 'express';

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId, password } = AuthValidation.resetPasswordZodSchema.parse(req.body);
    await AuthServices.resetPassword({
        password,
        sessionId
    });
    sendResponse.success(res, {
        statusCode: 200,
        message: "Password reset successful",
    });
}); 