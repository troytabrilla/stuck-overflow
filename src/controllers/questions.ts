import type { RequestHandler } from "express"

import parseId from "./lib/parse-id.js"
import Question from "../models/question.js"
import errorHandler from "./lib/error-handler.js"

export const fetch: RequestHandler = errorHandler(async (req, res) => {
    const id = parseId(req)
    const question = await Question.fetch(id, ["user", "answers", "comments"])

    res.json({
        data: question,
    })
})

export default {
    fetch,
}
