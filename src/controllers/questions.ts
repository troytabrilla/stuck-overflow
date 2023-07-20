import type { RequestHandler } from "express"

import parseId from "./lib/parse-id.js"
import Question from "../models/question.js"
import Answer, { type IAnswer } from "../models/answer.js"
import Comment from "../models/comment.js"
import errorHandler from "./lib/error-handler.js"
import NotFound from "./lib/errors/not-found.js"
import processApiQuery from "./lib/process-api-query.js"

export const fetch: RequestHandler = errorHandler(async (req, res) => {
    const id = parseId(req)
    const question = await Question.fetch(id)

    if (!question) {
        throw new NotFound("No question found.")
    }

    res.json({
        data: question,
    })
})

export const fetchAll: RequestHandler = errorHandler(async (req, res) => {
    const query = processApiQuery(req, ["id", "creation"])

    const total = await Question.countAll()
    const questions = await Question.fetchAll(query.paging, query.sorting)

    res.json({
        data: questions,
        paging: {
            ...query.paging,
            ...query.sorting,
            total,
        },
    })
})

// @note Not using an ORM meant having to join data and manually populate nested objects, which was getting
// hairy in the SQL queries, so I opted to fetch the data separately and join them in the application logic.
// It simplifies the code at the cost of less performance due to sending multiple queries. If performance
// becomes an issue, doing the joins in a single query and figuring out the nesting may be beneficial.
export const fetchFull: RequestHandler = errorHandler(async (req, res) => {
    const id = parseId(req)
    const question = await Question.fetch(id)

    if (!question) {
        throw new NotFound("No question found.")
    }

    const answers = await Answer.fetchAllFor("questions", question.id)
    const commentsForAnswers = await Comment.fetchAllFor(
        "answers",
        answers.map((a) => a.id)
    )
    const commentAnswerMap = commentsForAnswers.reduce((acc, comment) => {
        const { entity, ...rest } = comment
        if (!acc.get(entity.entity_id)) {
            acc.set(entity.entity_id, [])
        }
        acc.get(entity.entity_id).push(comment)
        return acc
    }, new Map())

    const commentsForQuestion = await Comment.fetchAllFor(
        "questions",
        question.id
    )

    res.json({
        data: {
            ...question,
            answers: answers.map((answer) => {
                return {
                    ...answer,
                    comments: commentAnswerMap.get(answer.id),
                }
            }),
            comments: commentsForQuestion,
        },
    })
})

export default {
    fetch,
    fetchAll,
    fetchFull,
}
