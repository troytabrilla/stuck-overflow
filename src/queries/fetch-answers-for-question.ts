import builder from "./lib/builder.js"
import joinUsers from "./lib/join-users.js"

const fetchAnswersForQuestions = (questionId: number) => {
    let query = builder
        .select("answers.*")
        .from("answers")
        .where("answers.question_id", questionId)
        .groupBy("answers.id")

    query = joinUsers(query, "answers")

    return query
}

export default fetchAnswersForQuestions
