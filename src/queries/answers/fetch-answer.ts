import builder from "../lib/builder.js"
import joinUsers from "../lib/join-users.js"

const fetchAnswer = (id: number) => {
    let query = builder
        .select("answers.*")
        .from("answers")
        .where("answers.id", id)
        .groupBy("answers.id")

    query = joinUsers(query, "answers")

    return query
}

export default fetchAnswer
