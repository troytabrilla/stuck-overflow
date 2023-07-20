import BadRequest from "../../controllers/lib/errors/bad-request.js"
import builder from "../lib/builder.js"
import joinUsers from "../lib/join-users.js"

export type CommentEntities = "questions" | "answers" | "users"

const fetchCommentsFor = (
    entityName: CommentEntities,
    entityIds: number | number[]
) => {
    if (typeof entityIds === "number") {
        entityIds = [entityIds]
    }

    let query = builder
        .select("comments.*")
        .from("comments")
        .groupBy("comments.id")

    // Handle joins through junction tables for questions and answers
    switch (entityName) {
        case "questions":
            query
                .join(
                    "question_comments",
                    "comments.id",
                    "question_comments.comment_id"
                )
                .select(builder.raw("'questions' AS entity_name"))
                .select("question_comments.question_id AS entity_id")
                .whereIn("question_comments.question_id", entityIds)
                .groupBy("question_comments.question_id")
            break
        case "answers":
            query
                .join(
                    "answer_comments",
                    "comments.id",
                    "answer_comments.comment_id"
                )
                .select(builder.raw("'answers' AS entity_name"))
                .select("answer_comments.answer_id AS entity_id")
                .whereIn("answer_comments.answer_id", entityIds)
                .groupBy("answer_comments.answer_id")
            break
        case "users":
            query.whereIn("comments.user_id", entityIds)
            break
        default:
            throw new BadRequest("Invalid entity for comments.")
    }

    if (entityName !== "users") {
        query = joinUsers(query, "comments")
    }

    return query
}

export default fetchCommentsFor
