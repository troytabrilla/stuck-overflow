import type { RequestHandler } from "express"

import parseId from "./lib/parse-id.js"
import User from "../models/user.js"
import Question from "../models/question.js"
import Answer from "../models/answer.js"
import Comment from "../models/comment.js"
import errorHandler from "./lib/error-handler.js"
import NotFound from "./lib/errors/not-found.js"

export const fetchFull: RequestHandler = errorHandler(async (req, res) => {
    const id = parseId(req)
    const user = await User.fetch(id)

    if (!user) {
        throw new NotFound("No user found.")
    }

    let questions: Question[] = []
    if (user) {
        questions = await Question.fetchAllFor("users", user.id)
    }

    let answers: Answer[] = []
    if (user) {
        answers = await Answer.fetchAllFor("users", user.id)
    }

    let comments: Comment[] = []
    if (user) {
        comments = await Comment.fetchAllFor("users", user.id)
    }

    res.json({
        data: {
            ...user,
            questions,
            answers,
            comments,
        },
    })
})

export default {
    fetchFull,
}
