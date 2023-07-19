import express from "express"

import users from "./controllers/users.js"
import questions from "./controllers/questions.js"

const router = express.Router()

router.get("/", async (_req, res) => {
    res.json({
        data: "Hello, world",
    })
})

router.get("/questions/:id", questions.fetch)

router.get("/users", users.fetchAll)

export default router
