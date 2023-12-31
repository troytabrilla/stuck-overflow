import pg from "pg"

// @note Ideally, all postgres queries should use a shared connection pool to improve performance and save resources,
// so I decided to encapsulate that here, as a sort of singleton.
const config = {
    host: process.env["POSTGRES_HOST"],
    user: process.env["POSTGRES_USER"],
    password: process.env["POSTGRES_PASSWORD"],
    database: process.env["POSTGRES_DB"],
}

export const pool = new pg.Pool(config)

export const query = async (queryStr: string) => {
    const results = await pool.query(queryStr)

    if (results?.rows?.length > 0) {
        return results.rows
    }

    return []
}

export default {
    pool,
    query,
}
