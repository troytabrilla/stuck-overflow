import joi from "joi"
import debug from "debug"

import validate from "./lib/validate.js"
import postgres from "../db/postgres.js"
import User, { validator as userValidator } from "./user.js"
import fetchCommentsFor from "../queries/comments/fetch-comments-for.js"
import fetchQuestion from "../queries/questions/fetch-question.js"
import fetchAnswer from "../queries/answers/fetch-answer.js"
import fetchUser from "../queries/users/fetch-user.js"
import createComment from "../queries/comments/create-comment.js"
import createCommentFor, {
    type CommentableEntities,
} from "../queries/comments/create-comment-for.js"
import BadRequest from "../controllers/lib/errors/bad-request.js"

import type { CommentEntities } from "../queries/comments/fetch-comments-for.js"

const logger = debug("stuck-overflow:src:models:comment")

export interface IComment {
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
    id: joi.number(),
    body: joi.string().min(2).max(5000).required(),
    user_id: joi.number().min(0).required(),
    user: userValidator,
})

interface IEntity {
    entity_name: string
    entity_id: number
}

const entityValidator = joi.object<IEntity>({
    entity_name: joi.string().valid("questions", "answers").required(),
    entity_id: joi.number().min(0).required(),
})

class Comment implements IComment {
    id: number
    body: string
    user_id: number
    user?: User | undefined
    entity?: IEntity

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

    static async fetchAllFor(
        entityName: CommentEntities,
        entityIds: number | number[]
    ) {
        const results = await postgres.query(
            fetchCommentsFor(entityName, entityIds).toString()
        )

        if (results.length) {
            return results.map((comment) => {
                const { entity_name, entity_id, ...rest } = comment
                return {
                    ...Comment.build(rest),
                    entity: {
                        entity_name,
                        entity_id,
                    },
                }
            })
        }

        return []
    }

    static async createFor(
        comment: IComment,
        entityName: CommentableEntities,
        entityId: number
    ) {
        let validated: IComment
        try {
            validated = this.validate(comment)
        } catch (err) {
            logger(err)
            throw new BadRequest("Invalid comment.")
        }

        const { value: entity, error } = entityValidator.validate({
            entity_name: entityName,
            entity_id: entityId,
        })
        if (error) {
            logger(error)
            throw new BadRequest("Invalid entity for comment.")
        }

        switch (entity.entity_name) {
            case "questions":
                const question = await postgres.query(
                    fetchQuestion(entity.entity_id).toString()
                )
                if (!question.length) {
                    logger("No question found for comment.")
                    throw new BadRequest("No question to comment on.")
                }
                break
            case "answers":
                const answer = await postgres.query(
                    fetchAnswer(entity.entity_id).toString()
                )
                if (!answer.length) {
                    logger("No answer found for comment.")
                    throw new BadRequest("No answer to comment on.")
                }
                break
            default:
                logger(`${entity.entity_name} is not valid.`)
                throw new BadRequest("Invalid entity for comments.")
        }

        const user = await postgres.query(fetchUser(comment.user_id).toString())
        if (!user.length) {
            logger("No user found for comment.")
            throw new BadRequest("No user for comment.")
        }

        const client = await postgres.pool.connect()
        let final: IComment
        try {
            await client.query("BEGIN")
            const results = await client.query(
                createComment(validated).toString()
            )
            const id = results?.rows[0]?.id
            final = { ...validated, id }
            await client.query(
                createCommentFor(final, entityName, entityId).toString()
            )
            await client.query("COMMIT")
            logger(`Committed queries`)
        } catch (err) {
            await client.query("ROLLBACK")
            logger(`Rolled back queries`)
            throw err
        } finally {
            await client.release()
        }

        return final
    }
}

export default Comment
