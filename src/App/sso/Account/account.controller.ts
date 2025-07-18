import catchAsync from "@/Utils/helper/catchAsync";
import { queryOptimization } from "@/Utils/helper/queryOptimize";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { IAuth } from "../Auth/auth.types";
import { AccountServices } from "./account.services";
import { accountFilterFields } from "./account.types";
import { AccountValidation } from "./account.validations";

const getAllAccounts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = queryOptimization<IAuth>(req, accountFilterFields as (keyof IAuth)[])
    const result = await AccountServices.getAllAccounts(payload)
    sendResponse.success(res, {
        statusCode: 200,
        message: "Accounts fetched successfully",
        data: result
    })
})

const getAccount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = z.string().parse(req.params.id)

    const result = await AccountServices.getAccount(id)

    sendResponse.success(res, {
        statusCode: 200,
        message: "Account fetched successfully",
        data: result
    })
})

const updateAccountInformation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = z.string().parse(req.params.id)
    const payload = AccountValidation.accountUpdateSchema.parse(req.body)
    console.log({ payload })
    const result = await AccountServices.updateAccountInformation(id, payload)
    sendResponse.success(res, {
        statusCode: 200,
        message: "Account information updated successfully",
        data: result
    })
})

const deleteAccount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = z.string().parse(req.params.id)
    await AccountServices.deleteAccount(id)
    sendResponse.success(res, {
        statusCode: 200,
        message: "Account deleted successfully",
    })
})

export const AccountController = {
    getAllAccounts,
    getAccount,
    updateAccountInformation,
    deleteAccount
}