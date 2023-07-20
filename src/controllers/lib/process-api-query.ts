import joi from "joi"
import debug from "debug"

import BadRequest from "./errors/bad-request.js"

import type { Request } from "express"
import type { Paging } from "../../queries/lib/paging.js"
import type { Sorting } from "../../queries/lib/sorting.js"

const logger = debug("stuck-overflow:src:controllers:lib:validate-api-query")

interface ApiQuery {
    paging?: Paging
    sorting?: Sorting
}

const exists = (val: any) => {
    return val != null
}

// Validate common API query parameters, i.e. paging and sorting and return standardized query object
const processApiQuery = (req: Request, validSortKeys: string[]): ApiQuery => {
    const validator = joi.object({
        limit: joi.number().min(0),
        offset: joi.number().min(0),
        sort_key: joi.string().valid(...validSortKeys),
        sort_dir: joi.string().valid("asc", "desc"),
    })

    const { value, error } = validator.validate(req.query)

    if (error) {
        logger(error)
        throw new BadRequest("Invalid API query")
    }

    const query: ApiQuery = {}

    if (exists(value.limit)) {
        query["paging"] = {
            limit: value.limit,
            offset: value.offset || 0,
        }
    }

    if (exists(value.sort_key)) {
        query["sorting"] = {
            sort_key: value.sort_key,
            sort_dir: value.sort_dir || "asc",
        }
    }

    return query
}

export default processApiQuery
