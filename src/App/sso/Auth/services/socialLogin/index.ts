import AuthModel from "../../auth.model";
import { ESessionType, TSocialLoginPayload } from "../../auth.types";
import { AuthUtils } from "../../auth.utils";
import RedisServices from "@/App/sso/Redis/services";
import CustomError from "@/Utils/errors/customError.class";
import { Types } from "mongoose";

export const socialLogin = async (payload: TSocialLoginPayload) => {
    try {
        const user = await AuthModel.findOne({ email: payload.email })
        if (!user) {
            const createPayload = {
                ...payload,
                isSocialLogin: true,
                socialLoginProvider: payload.socialLoginProvider,
                password: crypto.randomUUID()
            }
            const newUser = await AuthModel.create(createPayload)
            const sessionId = AuthUtils.generateSessionId()
            await RedisServices.login.storeLoginSession({
                sessionId,
                _id: newUser._id as Types.ObjectId,
                email: newUser.email,
                role: newUser.role,
                createdAt: new Date()
            })
            return {
                sessionId,
                is2FaEnabled: false,
                nextAction: "login"
            }
        }
        const sessionId = AuthUtils.generateSessionId()
        const metadata = {
            email: user.email,
            role: user.role,
            _id: user._id as Types.ObjectId,
            createdAt: new Date()
        }
        if (user.is2FaEnabled && user.twoFactorSecret) {
            await RedisServices.twoFactorAuthentication.store2FaSession({
                sessionId,
                email: user.email,
                secret: user.twoFactorSecret,
                expiresInMin: 2,
                remainingAttempts: 5,
                sessionType: ESessionType.LOGIN_2FA,
                metadata
            })
            return {
                sessionId,
                is2FaEnabled: true,
                nextAction: "login-2fa"
            }
        } else {
            const data = await RedisServices.login.storeLoginSession({
                sessionId,
                ...metadata,
            })
            return {
                sessionId,
                is2FaEnabled: false,
                nextAction: "login"
            }
        }
    } catch (error) {
        throw new CustomError('Something went wrong', 500);
    }
}; 