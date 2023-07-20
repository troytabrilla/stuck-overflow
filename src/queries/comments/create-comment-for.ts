import builder from "../lib/builder.js"

import type { IComment } from "../../models/comment.js"
import BadRequest from "../../controllers/lib/errors/bad-request.js"

export type CommentableEntities = "questions" | "answers"

const createCommentFor = (
    comment: IComment,
    entityName: CommentableEntities,
    entityId: number
) => {
    switch (entityName) {
        case "questions":
            return builder
                .insert({ comment_id: comment.id, question_id: entityId })
                .into("question_comments")
        case "answers":
            return builder
                .insert({ comment_id: comment.id, answer_id: entityId })
                .into("answer_comments")
        default:
            throw new BadRequest("Invalid entity for comments.")
    }
}

export default createCommentFor
