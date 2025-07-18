
import CustomError from "@/Utils/errors/customError.class";
import catchAsync from "@/Utils/helper/catchAsync";
import { NextFunction, Request, Response } from 'express';
import { AuthServices } from "../../services";

export const socialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as {
        sessionId: string,
        is2FaEnabled: boolean,
        nextAction: string
    }
    if (!data) {
        throw new CustomError("Social login failed", 400)
    }
    await AuthServices.afterLoginService({
        sessionId: data.sessionId,
        is2FaEnabled: data.is2FaEnabled,
        res
    })
    res.redirect('https://trelyt.com')
}); 