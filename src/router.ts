import express from "express"

import users from "./controllers/users.js"
import questions from "./controllers/questions.js"

const router = express.Router()

router.get("/questions", questions.fetchAll)
router.get("/questions/:id/full", questions.fetchFull)

router.get("/users/:id/full", users.fetchFull)

export default router
