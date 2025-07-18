import RedisServices from "@/App/sso/Redis/services";
import { ESessionType } from "../../auth.types";

export const logoutService = async (sessionId: string) => {
    await RedisServices.login.deleteSession({ sessionType: ESessionType.LOGIN, sessionId })
    return true
}; 