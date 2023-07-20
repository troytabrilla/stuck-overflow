import builder from "../lib/builder.js"

const countAllQuestions = () => {
    return builder.count("*").from("questions")
}

export default countAllQuestions
