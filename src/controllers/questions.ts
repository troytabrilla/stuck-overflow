import type { RequestHandler } from "express"

import parseId from "./lib/parse-id.js"
import Question from "../models/question.js"
import Answer from "../models/answer.js"
import Comment from "../models/comment.js"
import errorHandler from "./lib/middleware-error-handler.js"
import NotFound from "./lib/errors/not-found.js"
import processApiQuery from "./lib/process-api-query.js"

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

const fetchCommentsForAnswers = async (answers: Answer[]) => {
    if (answers.length) {
        const commentsForAnswers = await Comment.fetchAllFor(
            "answers",
            answers.map((a) => a.id)
        )

        const commentAnswerMap = commentsForAnswers.reduce((acc, comment) => {
            const { entity, ...rest } = comment
            if (!acc.get(entity.entity_id)) {
                acc.set(entity.entity_id, [])
            }
            acc.get(entity.entity_id).push(rest)
            return acc
        }, new Map())

        return answers.map((answer) => {
            return {
                ...answer,
                comments: commentAnswerMap.get(answer.id),
            }
        })
    }

    return answers
}

const fetchAnswersForQuestion = async (question: Question) => {
    let answers = await Answer.fetchAllFor("questions", question.id)

    return await fetchCommentsForAnswers(answers)
}

// @note Not using an ORM meant having to join data and manually populate deeply nested objects, which was getting
// hairy in the SQL queries, so I opted to fetch the data separately and join them in the application logic.
// It simplifies the code at the cost of less performance due to sending multiple queries. If performance
// becomes an issue, doing the joins in a single query and figuring out the nesting may be beneficial. Denormalizing
// the user data into the questions, answers, and comments tables could be quite useful in that case by reducing the
// amount of nesting by one level.
export const fetchFull: RequestHandler = errorHandler(async (req, res) => {
    const id = parseId(req)

    const question = await Question.fetch(id)
    if (!question) {
        throw new NotFound("No question found.")
    }

    const answers = await fetchAnswersForQuestion(question)
    const comments = await Comment.fetchAllFor("questions", question.id)

    res.json({
        data: {
            ...question,
            answers,
            comments,
        },
    })
})

export default {
    fetch,
    fetchAll,
    fetchFull,
}
