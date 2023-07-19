import BadRequest from "../controllers/lib/errors/bad-request.js"
import builder from "./lib/builder.js"
import joinUsers from "./lib/join-users.js"

export type CommentEntities = "questions" | "answers"

const fetchCommentsForEntity = (
    entityName: CommentEntities,
    entityId: number
) => {
    let query = builder
        .select("comments.*")
        .from("comments")
        .groupBy("comments.id")

    switch (entityName) {
        case "questions":
            query.join(
                "question_comments",
                "comments.id",
                "question_comments.comment_id"
            )
            query.where("question_comments.question_id", entityId)
            break
        case "answers":
            query.join(
                "answer_comments",
                "comments.id",
                "answer_comments.comment_id"
            )
            query.where("answer_comments.answer_id", entityId)
            break
        default:
            throw new BadRequest("Invalid entity for comments.")
    }

    query = joinUsers(query, "comments")

    return query
}

export default fetchCommentsForEntity
