import AuthModel from "../../auth.model";
import { ESessionType } from "../../auth.types";
import { AuthUtils } from "../../auth.utils";
import RedisServices from "@/App/sso/Redis/services";
import Config from "@/Config";
import CustomError from "@/Utils/errors/customError.class";
import { Types } from "mongoose";

export const generate2FaSession = async (_id: string | Types.ObjectId) => {
    const user = await AuthModel.findOne({ _id })
    if (!user) throw new CustomError('Invalid user', 404)
    if (user.is2FaEnabled) throw new CustomError('Two-factor authentication is already enabled', 400)
    const secret = await AuthUtils.generate2FaSession(user.email, Config.app_name)
    const sessionId = user.email.toLowerCase().trim()
    await RedisServices.twoFactorAuthentication.store2FaSession({
        sessionId,
        email: user.email,
        secret: secret.key,
        expiresInMin: 10,
        remainingAttempts: 4,
        sessionType: ESessionType.TWO_FACTOR_AUTHENTICATION
    })
    return {
        qrCode: secret.qrCode,
        key: secret.key,
        sessionId
    }
}; 