import { MongoQueryHelper } from "@/Utils/helper/queryOptimize";
import AuthModel from "../../auth.model";

export const findUserByEmail = async (email: string) => {
    const query = MongoQueryHelper('String', 'email', email)
    return await AuthModel.findOne(query);
}; 