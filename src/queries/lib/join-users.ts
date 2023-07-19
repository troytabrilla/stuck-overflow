import type { Knex } from "knex"

import builder from "./builder.js"

const joinUsers = (query: Knex.QueryBuilder, tableName: string) => {
    // @note The user data fetched is small enough that it can be joined to other queries, but if it got larger,
    // user data could potentially be moved out of the query and joined manually or denormalized.
    return query
        .select(builder.raw("row_to_json(users) AS user"))
        .join("users", `${tableName}.user_id`, "users.id")
        .groupBy("users.id")
}

export default joinUsers
