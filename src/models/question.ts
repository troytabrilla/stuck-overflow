import joi from "joi"
import debug from "debug"

import validate from "./lib/validate.js"
import postgres from "../db/postgres.js"
import fetchQuestion from "../queries/questions/fetch-question.js"
import fetchAllQuestions from "../queries/questions/fetch-all-questions.js"
import User, { validator as userValidator } from "./user.js"
import type { Paging } from "../queries/lib/paging.js"
import type { Sorting } from "../queries/lib/sorting.js"
import countAllQuestions from "../queries/questions/count-all-questions.js"
import fetchQuestionsFor, {
    type QuestionEntities,
} from "../queries/questions/fetch-questions-for.js"
import BadRequest from "../controllers/lib/errors/bad-request.js"

const logger = debug("stuck-overflow:src:models:question")

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
    id: joi.number(),
    title: joi.string().min(2).max(500).required(),
    body: joi.string().min(2).required(),
    score: joi.number(),
    creation: joi.date(),
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
        try {
            return validate(question, validator)
        } catch (err) {
            logger(err)
            throw new BadRequest("Invalid question.")
        }
    }

    static build(question: IQuestion) {
        if (typeof question.user === "object") {
            question.user = User.build(question.user)
        }

        const validated = Question.validate(question)
        return new Question(validated)
    }

    static async fetch(id: number) {
        const results = await postgres.query(fetchQuestion(id).toString())

        if (results.length) {
            return Question.build(results[0])
        }

        return null
    }

    static async fetchAll(paging?: Paging, sorting?: Sorting) {
        const results = await postgres.query(
            fetchAllQuestions(paging, sorting).toString()
        )

        return results.map(Question.build)
    }

    static async countAll() {
        const results = await postgres.query(countAllQuestions().toString())

        if (results[0]?.count) {
            return parseInt(results[0].count, 10)
        }

        return 0
    }

    static async fetchAllFor(entityName: QuestionEntities, entityId: number) {
        const results = await postgres.query(
            fetchQuestionsFor(entityName, entityId).toString()
        )

        return results.map(Question.build)
    }
}

export default Question
