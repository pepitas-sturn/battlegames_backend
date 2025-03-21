import { pickFunction } from "@/Utils/helper/pickFunction";
import {
    IQueryItems,
    PaginationKeys,
    SortKeys,
    TPaginationOptions,
    TSearchOption,
    TSortOptions
} from "@/Utils/types/query.type";
import { Request } from "express";

export const calculatePagination = (data: Partial<TPaginationOptions>): TPaginationOptions => {
    const page = Number(data.page || 1)
    const limit = Number(data.limit || 10)
    const skip = (page - 1) * limit
    return {
        page,
        limit,
        skip,
    }
}

export const manageSorting = <T>(data: Partial<TSortOptions<T>>): TSortOptions<T> => {
    const sortOrder = data.sortOrder || "desc"
    const sortBy = data.sortBy || "createdAt"
    return {
        sortOrder,
        sortBy
    }
}

export const queryOptimization = <M>(req: Request, fields: (keyof M)[], extraFields: string[] = []): IQueryItems<Partial<M>> => {
    const search: Partial<TSearchOption> = pickFunction(req.query, ["search"])
    const filter: any = pickFunction(req.query, [
        ...fields.map((field) => String(field)),
        ...extraFields
    ])
    const pagination: Partial<TPaginationOptions> = pickFunction(req.query, PaginationKeys)
    const sort: Partial<TSortOptions<M>> = pickFunction(req.query, SortKeys)

    return {
        searchFields: search ?? '',
        paginationFields: pagination,
        sortFields: sort,
        filterFields: filter,
    }
}