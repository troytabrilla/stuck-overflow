import type { Knex } from "knex"

export interface Paging {
    limit: number
    offset: number
}

export const addPaging = (query: Knex.QueryBuilder, paging: Paging) => {
    return query.limit(paging.limit).offset(paging.offset)
}
