import builder from "../lib/builder.js"
import joinUsers from "../lib/join-users.js"

const fetchQuestion = (id: number) => {
    let query = builder
        .select("questions.*")
        .from("questions")
        .where("questions.id", id)
        .groupBy("questions.id")

    query = joinUsers(query, "questions")

    return query
}

export default fetchQuestion
