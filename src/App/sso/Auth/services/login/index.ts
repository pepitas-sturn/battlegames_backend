import RedisServices from "@/App/sso/Redis/services";
import CustomError from "@/Utils/errors/customError.class";
import { HashHelper } from "@/Utils/helper/hashHelper";
import { MongoQueryHelper } from "@/Utils/helper/queryOptimize";
import { Types } from "mongoose";
import AuthModel from "../../auth.model";
import { EAccountStatus, ESessionType } from "../../auth.types";
import { AuthUtils } from "../../auth.utils";

export const login = async (email: string, password: string) => {
    const query = MongoQueryHelper('String', 'email', email)
    const user = await AuthModel.findOne(query);
    if (!user) {
        throw new CustomError('User not found', 404);
    }
    if (user.accountStatus !== EAccountStatus.ACTIVE) {
        throw new CustomError(`Account is ${user.accountStatus}. Please contact support.`, 400);
    }
    const isPasswordMatch = await HashHelper.comparePassword(password, user.password);
    if (!isPasswordMatch) {
        await RedisServices.login.storeFailedLoginAttempts({
            _id: user._id as Types.ObjectId,
            email: user.email
        })
        throw new CustomError('Invalid credentials', 400);
    }
    const sessionId = AuthUtils.generateSessionId()
    const metadata = {
        email: user.email,
        role: user.role,
        _id: user._id as Types.ObjectId,
        createdAt: new Date()
    }
    if (user.is2FaEnabled && user.twoFactorSecret) {
        const sessionId = AuthUtils.generateSessionId()
        await RedisServices.twoFactorAuthentication.store2FaSession({
            sessionId,
            email: user.email,
            secret: user.twoFactorSecret,
            expiresInMin: 2,
            remainingAttempts: 4,
            sessionType: ESessionType.LOGIN_2FA,
            metadata
        })
        return {
            sessionId,
            is2FaEnabled: true
        }
    } else {
        await RedisServices.login.storeLoginSession({
            sessionId,
            ...metadata,
        })
        return {
            sessionId,
            is2FaEnabled: false
        }
    }
}; 