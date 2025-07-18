
import catchAsync from "@/Utils/helper/catchAsync";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { AuthServices } from "../../services";
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = z.object({
        email: z.string().email()
    }).parse(req.body);
    const data = await AuthServices.forgetPassword(email);
    sendResponse.success(res, {
        statusCode: 200,
        message: "A instructions to reset your password has been sent to your email.",
        data
    });
}); 