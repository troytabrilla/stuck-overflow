import builder from "../lib/builder.js"
import BadRequest from "../../controllers/lib/errors/bad-request.js"

export type QuestionEntities = "users"

const fetchQuestionsFor = (entityName: QuestionEntities, entityId: number) => {
    let query = builder
        .select("questions.*")
        .from("questions")
        .groupBy("questions.id")

    switch (entityName) {
        case "users":
            query.where("questions.user_id", entityId)
            break
        default:
            throw new BadRequest("Invalid entity for questions.")
    }

    return query
}

export default fetchQuestionsFor
