import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { migrate as pgMigrate } from "postgres-migrations"

import { pool } from "../dist/db/postgres.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

const migrate = async (path) => {
    const client = await pool.connect()

    try {
        await pgMigrate({ client }, path)
    } finally {
        await client.release()
    }
}

migrate(path.join(__dirname, "..", "migrations"))
    .then(() => {
        console.log("Finished migrations.")
        process.exit(0)
    })
    .catch((err) => {
        console.error("Failed to run migrations:", err)
        process.exit(1)
    })
