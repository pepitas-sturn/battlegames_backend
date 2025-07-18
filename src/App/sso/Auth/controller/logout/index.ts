
import CustomError from "@/Utils/errors/customError.class";
import catchAsync from "@/Utils/helper/catchAsync";
import { NextFunction, Request, Response } from 'express';
import { AuthServices } from "../../services";

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies['auth-session-id']
    if (!sessionId) {
        throw new CustomError("Already logged out.", 400)
    }
    await AuthServices.logoutService(sessionId)
    res.clearCookie('auth-session-id');
    res.redirect('https://trelyt.com')
}); 