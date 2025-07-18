import Config from "@/Config";
import { TAfterLoginServicePayload } from "../../auth.types";

export const afterLoginService = async ({ sessionId, is2FaEnabled, res }: TAfterLoginServicePayload) => {
    if (is2FaEnabled && sessionId) {
        res.cookie('2fa-session-id', sessionId, {
            httpOnly: true,
            secure: Config.node_env === 'prod',
            maxAge: 2 * 60 * 1000,
            sameSite: 'strict',
            path: '/',
        })
    }
    if (sessionId && !is2FaEnabled) {
        res.cookie('auth-session-id', sessionId, {
            httpOnly: true,
            secure: Config.node_env === 'prod',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            path: '/',
        })
    }
}; 