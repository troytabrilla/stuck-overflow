import pg from "pg"

const config = {
    host: process.env["POSTGRES_HOST"],
    user: process.env["POSTGRES_USER"],
    password: process.env["POSTGRES_PASSWORD"],
    database: process.env["POSTGRES_DB"],
}

export const pool = new pg.Pool(config)

export default {
    pool,
}
