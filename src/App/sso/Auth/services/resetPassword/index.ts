import RedisServices from "@/App/sso/Redis/services";
import CustomError from "@/Utils/errors/customError.class";
import { HashHelper } from "@/Utils/helper/hashHelper";
import AuthModel from "../../auth.model";

export const resetPassword = async ({ password, sessionId }: { sessionId: string, password: string }) => {
    const sessionData = await RedisServices.resetPassword.getSession(sessionId)
    if (!sessionData) {
        throw new CustomError('Invalid session', 404);
    }
    const email = sessionData
    const hashedPassword = await HashHelper.generateHashPassword(password);
    await AuthModel.updateOne({ email }, { password: hashedPassword })
    await RedisServices.resetPassword.deleteSession(sessionId)
    return true
}; 