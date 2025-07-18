
import catchAsync from "@/Utils/helper/catchAsync";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { AuthValidation } from "../../auth.validation";
import { AuthServices } from "../../services";
import { NextFunction, Request, Response } from 'express';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = AuthValidation.userCreateZodSchema.parse(req.body);
    console.log({ payload });
    const data = await AuthServices.createUser(payload);

    sendResponse.success(res, {
        statusCode: 200,
        message: "Registration successful. Please check your email for verification instructions.",
        data
    });
}); 