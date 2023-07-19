import express from "express"

import postgres from "./db/postgres.js"
import findAllUsers from "./queries/find-all-users.js"

const router = express.Router()

router.get("/", async (_req, res) => {
    res.json({
        data: "Hello, world",
    })
})

router.get("/users", async (_req, res) => {
    const results = await postgres.pool.query(findAllUsers())
    res.json({
        data: results.rows,
    })
})

export default router
