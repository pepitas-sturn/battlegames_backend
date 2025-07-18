
import catchAsync from "@/Utils/helper/catchAsync";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { NextFunction, Request, Response } from 'express';
import { AuthValidation } from "../../auth.validation";
import { AuthServices } from "../../services";

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = AuthValidation.userLoginZodSchema.parse(req.body);
    const data = await AuthServices.login(email, password);
    await AuthServices.afterLoginService({
        sessionId: data.sessionId,
        is2FaEnabled: data.is2FaEnabled,
        res
    })
    sendResponse.success(res, {
        statusCode: 200,
        message: data.is2FaEnabled ? "2FA enabled. Enter a code from your authenticator app to login." : "Login successful",
    });
}); 