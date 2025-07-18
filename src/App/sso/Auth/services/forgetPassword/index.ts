import AuthModel from "../../auth.model";
import { ESessionType } from "../../auth.types";
import { AuthUtils } from "../../auth.utils";
import { MailServices } from "@/App/sso/Mail/mail.services";
import RedisServices from "@/App/sso/Redis/services";
import Config from "@/Config";
import { ENodeEnv } from "@/Config/utils/config.types";
import CustomError from "@/Utils/errors/customError.class";
import { MongoQueryHelper } from "@/Utils/helper/queryOptimize";

export const forgetPassword = async (email: string) => {
    const query = MongoQueryHelper('String', 'email', email)
    const user = await AuthModel.findOne(query);
    if (!user) {
        throw new CustomError('User not found', 404);
    }
    const sessionId = email.toLowerCase().trim()
    const otp = AuthUtils.generateOTP()
    const resetUrl = `${Config.frontend.reset_page_url}?session=${sessionId}&otp=${otp}`
    await RedisServices.otp.createSession({
        sessionId,
        email,
        otp,
        redirectUrl: resetUrl,
        expiresInMin: 10,
        remainingAttempts: 4,
        blockStatus: "false",
        sessionType: ESessionType.FORGET_PASSWORD
    })
    Config.node_env === ENodeEnv.PROD ? MailServices.forgetPassword({
        email,
        otp,
        resetUrl: resetUrl
    }) : null
    return {
        sessionId
    }
}; 