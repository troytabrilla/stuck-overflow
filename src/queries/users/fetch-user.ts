import builder from "../lib/builder.js"

const fetchUser = (id: number) => {
    let query = builder.select("*").from("users").where("users.id", id)

    return query
}

export default fetchUser
