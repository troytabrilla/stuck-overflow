import type { Knex } from "knex"

export type SortDir = "asc" | "desc"

export interface Sorting {
    sort_key: string
    sort_dir: SortDir
}

export const addSorting = (query: Knex.QueryBuilder, sorting: Sorting) => {
    return query.orderBy(sorting.sort_key, sorting.sort_dir)
}
