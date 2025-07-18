import { allowedOtpSessionTypes, ESessionType } from "../../auth.types";
import { AuthUtils } from "../../auth.utils";
import { MailServices } from "@/App/sso/Mail/mail.services";
import RedisServices from "@/App/sso/Redis/services";
import Config from "@/Config";
import { ENodeEnv } from "@/Config/utils/config.types";
import CustomError from "@/Utils/errors/customError.class";

export const resendOtp = async ({ sessionId, sessionType }: { sessionId: string, sessionType: ESessionType }) => {
    if (!allowedOtpSessionTypes.includes(sessionType)) {
        throw new CustomError('Invalid request', 400);
    }
    const sessionData = await RedisServices.otp.getASession({ sessionType, sessionId })
    if (!sessionData) {
        throw new CustomError('Invalid session', 404);
    }
    const currentRemainingAttempts = sessionData.remainingAttempts as number
    if (currentRemainingAttempts <= 0) {
        throw new CustomError('Too many failed attempts. Please try again later.', 400);
    }
    const remainingAttempts = currentRemainingAttempts - 1
    const ttl = remainingAttempts === 0 ? 24 * 60 : 10
    const otp = AuthUtils.generateOTP()
    if (sessionType === ESessionType.EMAIL_VERIFICATION) {
        Config.node_env === ENodeEnv.PROD ? MailServices.forgetPassword({
            email: sessionData.email,
            otp,
            resetUrl: sessionData.redirectUrl ?? "",
        }) : null
    }
    if (sessionType === ESessionType.ACCOUNT_VERIFICATION) {
        Config.node_env === ENodeEnv.PROD ? MailServices.accountVerification({
            email: sessionData.email,
            otp,
            verifyUrl: sessionData.redirectUrl ?? "",
        }) : null
    }
    const payload = { sessionId, otp, remainingAttempts, expiresInMin: ttl, sessionType }
    await RedisServices.otp.updateSession(payload)
    return {
        sessionId
    }
}; 