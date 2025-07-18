import CustomError from "@/Utils/errors/customError.class";
import AuthModel from "../../auth.model";
import { TChangeAccountStatusPayload } from "../../auth.types";

export const changeAccountStatus = async (payload: TChangeAccountStatusPayload) => {
    const user = await AuthModel.findOne({ _id: payload._id })
    if (!user) throw new CustomError('Invalid user', 404)
    if (user.accountStatus === payload.status) throw new CustomError(`Account status is already ${payload.status}`, 400)
    await AuthModel.updateOne({ _id: payload._id }, { accountStatus: payload.status, statusNote: payload.statusNote ?? "" })
    return true
}; 