import builder from "./lib/builder.js"

const fetchAllUsers = () => {
    return builder.select("*").from("users")
}

export default fetchAllUsers
