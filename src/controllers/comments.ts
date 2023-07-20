import type { RequestHandler } from "express"

import Comment from "../models/comment.js"
import errorHandler from "./lib/error-handler.js"

export const create: RequestHandler = errorHandler(async (req, res) => {
    const { entity_name, entity_id, ...body } = req.body

    const comment = await Comment.createFor(body, entity_name, entity_id)

    res.json({
        data: {
            comment,
        },
    })
})

export default {
    create,
}
