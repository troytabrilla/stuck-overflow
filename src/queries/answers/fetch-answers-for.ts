import builder from "../lib/builder.js"
import joinUsers from "../lib/join-users.js"
import BadRequest from "../../controllers/lib/errors/bad-request.js"

export type AnswerEntities = "questions" | "users"

const fetchAnswersFor = (entityName: AnswerEntities, entityId: number) => {
    let query = builder
        .select("answers.*")
        .from("answers")
        .groupBy("answers.id")

    switch (entityName) {
        case "questions":
            query.where("answers.question_id", entityId)
            query = joinUsers(query, "comments")
            break
        case "users":
            query.where("answers.user_id", entityId)
            break
        default:
            throw new BadRequest("Invalid entity for answers.")
    }

    return query
}

export default fetchAnswersFor
