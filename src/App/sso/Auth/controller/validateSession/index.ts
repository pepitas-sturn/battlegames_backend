
import Config from "@/Config";
import catchAsync from "@/Utils/helper/catchAsync";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { ESessionType } from "../../auth.types";
import { AuthServices } from "../../services";
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validateSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { otp, sessionType } = z.object({
        otp: z.string(),
        sessionType: z.nativeEnum(ESessionType),
    }).parse(req.body);
    let tempSessionId: string | null = null;
    if (sessionType === ESessionType.LOGIN_2FA) {
        tempSessionId = req.cookies['2fa-session-id'];
    } else {
        tempSessionId = req.body.sessionId;
    }
    const sessionId = z.string({
        required_error: "Session ID is required"
    }).parse(tempSessionId);
    const data = await AuthServices.validateSession({
        sessionId,
        otp,
        sessionType
    });
    if (data.validated && data.sessionId && data.nextAction === "login") {
        res.clearCookie('2fa-session-id');
        res.cookie('auth-session-id', data.sessionId, {
            httpOnly: true,
            secure: Config.node_env === 'prod',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            path: '/',
        });
    }
    sendResponse.success(res, {
        statusCode: 200,
        message: "Session validated successfully",
        data
    });
}); 