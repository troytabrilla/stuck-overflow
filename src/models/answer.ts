import joi from "joi"

import validate from "./lib/validate.js"
import postgres from "../db/postgres.js"
import User, { validator as userValidator } from "./user.js"
import fetchAnswersForQuestions from "../queries/fetch-answers-for-question.js"

export interface IAnswer {
    id: number
    body: string
    score: number
    accepted: boolean
    creation: Date
    user_id: number
    question_id: number
    user?: User | undefined
}

export const validator = joi.object<IAnswer>({
    id: joi.number().required(),
    body: joi.string().min(2).required(),
    score: joi.number().required(),
    accepted: joi.boolean().required(),
    creation: joi.date().required(),
    user_id: joi.number().min(0).required(),
    question_id: joi.number().min(0).required(),
    user: userValidator,
})

class Answer implements IAnswer {
    id: number
    body: string
    score: number
    accepted: boolean
    creation: Date
    user_id: number
    question_id: number
    user?: User | undefined

    constructor(answer: IAnswer) {
        this.id = answer.id
        this.body = answer.body
        this.score = answer.score
        this.accepted = answer.accepted
        this.creation = answer.creation
        this.user_id = answer.user_id
        this.question_id = answer.question_id
        this.user = answer.user
    }

    static validate(answer: IAnswer) {
        return validate(answer, validator)
    }

    static build(answer: IAnswer) {
        if (typeof answer.user === "object") {
            answer.user = User.build(answer.user)
        }

        const validated = Answer.validate(answer)
        return new Answer(validated)
    }

    static async fetchAllForQuestion(question_id: number) {
        const results = await postgres.pool.query(
            fetchAnswersForQuestions(question_id).toString()
        )

        if (results?.rows?.length > 0) {
            return results.rows.map(Answer.build)
        }

        return []
    }
}

export default Answer
