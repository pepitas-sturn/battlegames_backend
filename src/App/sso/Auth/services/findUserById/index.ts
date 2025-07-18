import AuthModel from "../../auth.model";

export const findUserById = async (id: string) => {
    return await AuthModel.findById(id);
}; 