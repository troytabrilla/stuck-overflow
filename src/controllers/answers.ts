import type { RequestHandler } from "express"

import Answer from "../models/answer.js"
import errorHandler from "./lib/error-handler.js"

export const create: RequestHandler = errorHandler(async (req, res) => {
    const answer = await Answer.create(req.body)

    res.json({
        data: {
            answer,
        },
    })
})

export default {
    create,
}
