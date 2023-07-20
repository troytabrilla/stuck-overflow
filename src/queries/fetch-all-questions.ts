import builder from "./lib/builder.js"

const fetchAllQuestions = () => {
    return builder.select("*").from("questions")
}

export default fetchAllQuestions
