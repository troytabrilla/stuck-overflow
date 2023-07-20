import joi from "joi"

import validate from "./lib/validate.js"
import postgres from "../db/postgres.js"
import fetchQuestion from "../queries/fetch-question.js"
import fetchAllQuestions from "../queries/fetch-all-questions.js"
import User, { validator as userValidator } from "./user.js"

interface IQuestion {
    id: number
    title: string
    body: string
    score: number
    creation: Date
    user_id: number
    user?: User | undefined
}

const validator = joi.object<IQuestion>({
    id: joi.number().required(),
    title: joi.string().min(2).max(500).required(),
    body: joi.string().min(2).required(),
    score: joi.number().required(),
    creation: joi.date().required(),
    user_id: joi.number().min(0).required(),
    user: userValidator,
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
    creation: Date
    user_id: number
    user?: User | undefined

    constructor(question: IQuestion) {
        this.id = question.id
        this.title = question.title
        this.body = question.body
        this.score = question.score
        this.creation = question.creation
        this.user_id = question.user_id
        this.user = question.user
    }

    static validate(question: IQuestion) {
        return validate(question, validator)
    }

    static build(question: IQuestion) {
        if (typeof question.user === "object") {
            question.user = User.build(question.user)
        }

        const validated = Question.validate(question)
        return new Question(validated)
    }

    static async fetch(id: number) {
        const results = await postgres.pool.query(fetchQuestion(id).toString())

        if (results?.rows[0]) {
            return Question.build(results.rows[0])
        }

        return null
    }

    static async fetchAll() {
        const results = await postgres.pool.query(
            fetchAllQuestions().toString()
        )

        if (results?.rows?.length > 0) {
            return results.rows.map(Question.build)
        }
    }
}

export default Question
