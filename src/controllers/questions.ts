import type { RequestHandler } from "express"

import parseId from "./lib/parse-id.js"
import Question from "../models/question.js"
import Answer from "../models/answer.js"
import errorHandler from "./lib/error-handler.js"

// @note Not using an ORM meant having to manually join data, which was getting hairy in the SQL queries,
// so I opted to fetch the data separately and join them in the application logic. It simplifies the code
// at the cost of less performance due to sending multiple queries. If performance becomes an issue, doing
// the joins in a single query may be beneficial.
export const fetch: RequestHandler = errorHandler(async (req, res) => {
    const id = parseId(req)
    const question = await Question.fetch(id)

    let answers: Answer[] = []
    if (question) {
        answers = await Answer.fetchAllForQuestion(question.id)
    }

    res.json({
        data: {
            ...question,
            answers,
        },
    })
})

export default {
    fetch,
}
