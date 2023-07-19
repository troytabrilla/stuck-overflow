import joi from "joi"

import validate from "./lib/validate.js"

export interface IAnswer {
    id: number
    body: string
    score: number
    accepted: boolean
    creation: Date
    user_id: number
    question_id: number
}

export const validator = joi.object<IAnswer>({
    id: joi.number().required(),
    body: joi.string().min(2).max(5000).required(),
    score: joi.number().required(),
    accepted: joi.boolean().required(),
    creation: joi.date().required(),
    user_id: joi.number().min(0).required(),
    question_id: joi.number().min(0).required(),
})

class Answer implements IAnswer {
    id: number
    body: string
    score: number
    accepted: boolean
    creation: Date
    user_id: number
    question_id: number

    constructor(answer: IAnswer) {
        this.id = answer.id
        this.body = answer.body
        this.score = answer.score
        this.accepted = answer.accepted
        this.creation = answer.creation
        this.user_id = answer.user_id
        this.question_id = answer.question_id
    }

    static validate(answer: IAnswer) {
        return validate(answer, validator)
    }

    static build(answer: IAnswer) {
        const validated = Answer.validate(answer)
        return new Answer(validated)
    }
}

export default Answer
