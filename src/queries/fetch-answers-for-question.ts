import builder from "./lib/builder.js"
import joinUsers from "./lib/join-users.js"

const fetchAnswersForQuestions = (question_id: number) => {
    let query = builder
        .select("answers.*")
        .from("answers")
        .where("answers.question_id", question_id)
        .groupBy("answers.id")

    query = joinUsers(query, "answers")

    return query
}

export default fetchAnswersForQuestions
