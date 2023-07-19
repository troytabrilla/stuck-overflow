import builder from "./lib/builder.js"

export type QuestionInclude = "user" | "answers" | "comments"

const fetchQuestion = (id: number, include?: QuestionInclude[]) => {
    const query = builder.from("questions").where("questions.id", id)

    if (include) {
        query.select("questions.*")
        query.groupBy("questions.id")

        if (include.includes("user")) {
            query.join("users", "questions.user_id", "users.id")
            query.groupBy("users.id")
            query.select(builder.raw("row_to_json(users) AS user"))
        }

        if (include.includes("answers")) {
            query.leftJoin("answers", "questions.id", "answers.question_id")
            query.groupBy("answers.id")
            query.select(
                builder.raw("json_agg(row_to_json(answers)) AS answers")
            )
        }

        if (include.includes("comments")) {
            query.leftJoin("comments", "questions.id", "comments.question_id")
            query.groupBy("comments.id")
            query.select(
                builder.raw("json_agg(row_to_json(comments)) AS comments")
            )
        }
    } else {
        query.select("*")
    }

    console.log(query.toString())

    return query
}

export default fetchQuestion
