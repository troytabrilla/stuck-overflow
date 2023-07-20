import express from "express"

import answers from "./controllers/answers.js"
import questions from "./controllers/questions.js"
import users from "./controllers/users.js"

const router = express.Router()

router.post("/answers", answers.create)

router.get("/questions", questions.fetchAll)
router.get("/questions/:id/full", questions.fetchFull)

router.get("/users/:id/full", users.fetchFull)

export default router
