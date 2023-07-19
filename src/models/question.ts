import joi from "joi"

import validate from "./lib/validate.js"

interface IQuestion {
    id: number
    title: string
    body: string
    score: number
    creation: number
    user_id: number
}

const validator = joi.object<IQuestion>({
    id: joi.number().required(),
    title: joi.string().min(2).max(500).required(),
    body: joi.string().min(2).max(5000).required(),
    score: joi.number().required(),
    creation: joi.number().min(0).required(),
    user_id: joi.number().min(0).required(),
})

// @note I chose to use classes to model the given data. The main reason was to encapsulate common methods like
// validation, fetching, updating, and creation. I think it makes sense to keep these methods together, because
// it makes it easier to understand the underlying data and make changes to the code that operates on this data.
// Another option would be to use an ORM library, but I wasn't sure this application needed the additional
// complexity. One downside to this is that queries and migrations are separate from this model, so changes need
// to be synced between these files, which could get annoying in the future.
class Question implements IQuestion {
    id: number
    title: string
    body: string
    score: number
    creation: number
    user_id: number

    constructor(question: IQuestion) {
        this.id = question.id
        this.title = question.title
        this.body = question.body
        this.score = question.score
        this.creation = question.creation
        this.user_id = question.user_id
    }

    static validate(question: IQuestion) {
        return validate(question, validator)
    }

    static build(question: IQuestion) {
        const validated = Question.validate(question)
        return new Question(validated)
    }
}

export default Question
