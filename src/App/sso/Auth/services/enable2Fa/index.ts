import RedisServices from "@/App/sso/Redis/services";
import CustomError from "@/Utils/errors/customError.class";
import AuthModel from "../../auth.model";
import { ESessionType } from "../../auth.types";
import { AuthUtils } from "../../auth.utils";

export const enable2Fa = async (_id: string, otp: string, sessionId: string) => {
    const sessionData = await RedisServices.twoFactorAuthentication.get2FaSession({ sessionType: ESessionType.TWO_FACTOR_AUTHENTICATION, sessionId })
    if (!sessionData) throw new CustomError('Invalid session.', 400)
    const isValid = await AuthUtils.verify2FaOTP(sessionData.secret, otp)
    if (!isValid) throw new CustomError('Invalid OTP.', 400)
    await AuthModel.updateOne({ _id }, { is2FaEnabled: true, twoFactorSecret: sessionData.secret })
    await RedisServices.twoFactorAuthentication.delete2FaSession({ sessionType: ESessionType.TWO_FACTOR_AUTHENTICATION, sessionId })
    return true
}; 