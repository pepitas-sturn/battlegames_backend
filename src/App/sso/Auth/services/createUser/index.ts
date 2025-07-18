import { MailServices } from "@/App/sso/Mail/mail.services";
import RedisServices from "@/App/sso/Redis/services";
import Config from "@/Config";
import CustomError from "@/Utils/errors/customError.class";
import { HashHelper } from "@/Utils/helper/hashHelper";
import AuthModel from "../../auth.model";
import { ESessionType, TUserCreatePayload } from "../../auth.types";
import { AuthUtils } from "../../auth.utils";

export const createUser = async (payload: TUserCreatePayload) => {
    const existingUser = await AuthModel.findOne({ email: payload.email });
    if (existingUser) {
        throw new CustomError('User already exists with this email', 400);
    }

    const hashedPassword = await HashHelper.generateHashPassword(payload.password);
    await AuthModel.create({
        ...payload,
        password: hashedPassword
    });

    const otp = AuthUtils.generateOTP()
    const sessionId = payload.email.toLowerCase().trim()
    const verifyUrl = `${Config.frontend.verify_page_url}?session=${sessionId}&otp=${otp}`

    await RedisServices.otp.createSession({
        sessionId,
        email: payload.email,
        otp,
        redirectUrl: verifyUrl,
        expiresInMin: 10,
        remainingAttempts: 4,
        blockStatus: "false",
        sessionType: ESessionType.ACCOUNT_VERIFICATION
    })
    Config.node_env === "production" ? MailServices.accountVerification({
        email: payload.email,
        otp,
        verifyUrl: verifyUrl
    }) : null
    return {
        sessionId
    }
}; 