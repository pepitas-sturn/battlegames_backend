import CustomError from "@/Utils/errors/customError.class";
import AuthModel from "../../auth.model";
import { AuthUtils } from "../../auth.utils";

export const disable2Fa = async (_id: string, otp: string) => {
    const user = await AuthModel.findOne({ _id })
    if (!user) throw new CustomError('Invalid user', 404)
    if (!user.is2FaEnabled || !user.twoFactorSecret) throw new CustomError('Two-factor authentication is not enabled', 400)
    const isValid = await AuthUtils.verify2FaOTP(user.twoFactorSecret, otp)
    if (!isValid) throw new CustomError('Invalid OTP.', 400)
    await AuthModel.updateOne({ _id }, { is2FaEnabled: false, twoFactorSecret: "" })
    return true
}; 