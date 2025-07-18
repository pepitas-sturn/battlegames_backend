import { ESessionType } from "@/App/sso/Auth/auth.types";

export const getSessionKey = (sessionType: ESessionType, sessionId: string) => {
    return `${sessionType}:${sessionId}`;
}