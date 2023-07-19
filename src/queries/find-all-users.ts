import knex from "knex"

const builder = knex({ client: "pg" })

const findAllUsers = () => {
    return builder.select("*").from("users").toString()
}

export default findAllUsers
