import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { migrate as pgMigrate } from "postgres-migrations"

import { pool } from "../dist/db/postgres.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

// @note These migration/seeding tools are written in JavaScript so they can be run in npm scripts
// without having to be compiled. They exist outside of the src directory because they're not meant
// to be included in the application. There may be a more elegant way to handle this with compiler
// options, but I just went with this to save time for other functionality.
const migrate = async (path) => {
    const client = await pool.connect()

    try {
        await pgMigrate({ client }, path)
    } finally {
        await client.release()
    }
}

// @note For production, it'd be prudent to have better logging for failures, especially if these
// migrations are handled during CI/CD.
migrate(path.join(__dirname, "..", "migrations"))
    .then(() => {
        console.log("Finished migrations.")
        process.exit(0)
    })
    .catch((err) => {
        console.error("Failed to run migrations:", err)
        process.exit(1)
    })
