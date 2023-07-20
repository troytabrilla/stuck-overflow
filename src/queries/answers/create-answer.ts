import builder from "../lib/builder.js"

import type { IAnswer } from "../../models/answer.js"

const createAnswer = (answer: IAnswer) => {
    return builder.insert(answer).into("answers").returning("id")
}

export default createAnswer
