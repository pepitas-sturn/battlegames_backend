import { RedisCommonActions } from "@/App/sso/Redis/common/actions";
import RedisServices from "@/App/sso/Redis/services";
import { TOtpGroupSession, TTwoFactorAuthenticationSessionCreatePayload } from "@/App/sso/Redis/session.types";
import CustomError from "@/Utils/errors/customError.class";
import AuthModel from "../../auth.model";
import { ESessionType } from "../../auth.types";
import { AuthUtils } from "../../auth.utils";

export const validateSession = async ({ otp, sessionId, sessionType }: { sessionId: string, otp: string, sessionType: ESessionType }) => {
    if (sessionType === ESessionType.FORGET_PASSWORD) {
        const sessionData = await RedisCommonActions.getASession<TOtpGroupSession>({ sessionType, sessionId })
        if (!sessionData || sessionData.otp !== otp) {
            throw new CustomError('Invalid session', 404);
        }
        const resetPasswordSessionId = AuthUtils.generateSessionId()
        await RedisServices.resetPassword.createSession({
            sessionId: resetPasswordSessionId,
            email: sessionData.email,
            expiresInMin: 5,
        })
        await RedisServices.otp.deleteSession({ sessionType, sessionId })
        return {
            validated: true,
            sessionId: resetPasswordSessionId,
            nextAction: "reset-password"
        }
    }
    if (sessionType === ESessionType.EMAIL_VERIFICATION || sessionType === ESessionType.ACCOUNT_VERIFICATION) {
        const sessionData = await RedisCommonActions.getASession<TOtpGroupSession>({ sessionType, sessionId })
        if (!sessionData || sessionData.otp !== otp) {
            throw new CustomError('Invalid session or Incorrect OTP.', 404);
        }
        await AuthModel.updateOne({ email: sessionData.email }, { isEmailVerified: true })
        // await AuthRedisServices.deleteSession(sessionType, sessionId)
        await RedisServices.otp.deleteSession({ sessionType, sessionId })
        return {
            validated: true,
        }
    }
    if (sessionType === ESessionType.LOGIN_2FA) {
        const sessionData = await RedisCommonActions.getASession<TTwoFactorAuthenticationSessionCreatePayload>({ sessionType: ESessionType.LOGIN_2FA, sessionId })
        if (!sessionData) {
            throw new CustomError('Invalid session', 404);
        }
        const isValid = await AuthUtils.verify2FaOTP(sessionData.secret, otp)
        if (!isValid) {
            throw new CustomError('Invalid OTP.', 400);
        }
        const metadata = {
            email: sessionData.email,
            role: sessionData.metadata?.role,
            _id: sessionData.metadata?._id,
            createdAt: new Date()
        }
        await RedisServices.login.storeLoginSession({
            sessionId,
            ...metadata,
        })
        await RedisServices.twoFactorAuthentication.delete2FaSession({ sessionType: ESessionType.LOGIN_2FA, sessionId })
        return {
            validated: true,
            sessionId,
            nextAction: "login",
        }
    }
    throw new CustomError('Invalid session', 400);
}; 