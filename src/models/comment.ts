import joi from "joi"

import validate from "./lib/validate.js"
import postgres from "../db/postgres.js"
import User, { validator as userValidator } from "./user.js"
import fetchCommentsForEntity from "../queries/fetch-comments-for-entity.js"

import type { CommentEntities } from "../queries/fetch-comments-for-entity.js"

interface IComment {
    id: number
    body: string
    user_id: number
    user?: User | undefined
}

// @note Comments can belong to either a question or an answer, but not both at the same time.
// I didn't want to just add foreign keys to both tables that would only be used half the time,
// so I decided to use junction tables to describe the comment relationships with questions and
// answers.
interface IQuestionComment {
    question_id: number
    comment_id: number
}

interface IAnswerComment {
    answer_id: number
    comment_id: number
}

export const validator = joi.object<IComment>({
    id: joi.number().required(),
    body: joi.string().min(2).max(5000).required(),
    user_id: joi.number().min(0).required(),
    user: userValidator,
})

class Comment implements IComment {
    id: number
    body: string
    user_id: number
    user?: User | undefined

    constructor(comment: IComment) {
        this.id = comment.id
        this.body = comment.body
        this.user_id = comment.user_id
        this.user = comment.user
    }

    static validate(comment: IComment) {
        return validate(comment, validator)
    }

    static build(comment: IComment) {
        if (typeof comment.user === "object") {
            comment.user = User.build(comment.user)
        }

        const validated = Comment.validate(comment)
        return new Comment(validated)
    }

    static async fetchAllForEntity(
        entityName: CommentEntities,
        entityId: number
    ) {
        const results = await postgres.pool.query(
            fetchCommentsForEntity(entityName, entityId).toString()
        )

        if (results?.rows?.length > 0) {
            return results.rows.map((comment: IComment) =>
                Comment.build(comment)
            )
        }

        return []
    }
}

export default Comment
