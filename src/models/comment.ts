import joi from "joi"

import validate from "./lib/validate.js"

interface IComment {
    id: number
    body: string
    user_id: number
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
})

class Comment implements IComment {
    id: number
    body: string
    user_id: number

    constructor(comment: IComment) {
        this.id = comment.id
        this.body = comment.body
        this.user_id = comment.user_id
    }

    static validate(comment: IComment) {
        return validate(comment, validator)
    }

    static build(comment: IComment) {
        const validated = Comment.validate(comment)
        return new Comment(validated)
    }
}

export default Comment
