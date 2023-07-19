import builder from "./lib/builder.js"

const findAllUsers = () => {
    return builder.select("*").from("users").toString()
}

export default findAllUsers
