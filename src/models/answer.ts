import joi from "joi"
import debug from "debug"

import validate from "./lib/validate.js"
import postgres from "../db/postgres.js"
import User, { validator as userValidator } from "./user.js"
import fetchAnswersFor, {
    type AnswerEntities,
} from "../queries/answers/fetch-answers-for.js"
import fetchQuestion from "../queries/questions/fetch-question.js"
import fetchUser from "../queries/users/fetch-user.js"
import createAnswer from "../queries/answers/create-answer.js"
import BadRequest from "../controllers/lib/errors/bad-request.js"

const logger = debug("stuck-overflow:src:models:answer")

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
    id: joi.number(),
    body: joi.string().min(2).required(),
    score: joi.number(),
    accepted: joi.boolean(),
    creation: joi.date(),
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
        try {
            return validate(answer, validator)
        } catch (err) {
            logger(err)
            throw new BadRequest("Invalid answer.")
        }
    }

    static build(answer: IAnswer) {
        if (typeof answer.user === "object") {
            answer.user = User.build(answer.user)
        }

        const validated = Answer.validate(answer)

        return new Answer(validated)
    }

    static async fetchAllFor(entityName: AnswerEntities, entityId: number) {
        const results = await postgres.query(
            fetchAnswersFor(entityName, entityId).toString()
        )

        return results.map(Answer.build)
    }

    private static async validateQuestionForAnswer(answer: IAnswer) {
        const question = await postgres.query(
            fetchQuestion(answer.question_id).toString()
        )

        if (!question.length) {
            logger("No question found for answer.")
            throw new BadRequest("No question to answer.")
        }
    }

    private static async validateUserForAnswer(answer: IAnswer) {
        const user = await postgres.query(fetchUser(answer.user_id).toString())

        if (!user.length) {
            logger("No user found for answer.")
            throw new BadRequest("No user for answer.")
        }
    }

    static async create(answer: IAnswer) {
        await this.validateQuestionForAnswer(answer)
        await this.validateUserForAnswer(answer)

        const defaults = {
            score: 0,
            accepted: false,
            creation: new Date(),
        }

        const validated = this.validate({ ...defaults, ...answer })
        const results = await postgres.query(createAnswer(validated).toString())

        return {
            ...validated,
            id: results[0]?.id,
        }
    }
}

export default Answer
