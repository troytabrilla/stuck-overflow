import fs from "fs/promises"
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { pool } from "../dist/db/postgres.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

const runQueriesInTransaction = async (name, queries) => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")
        await Promise.all(queries.map((query) => client.query(query)))
        await client.query("COMMIT")
        console.log(`Committed ${name} queries`)
    } catch (err) {
        await client.query("ROLLBACK")
        console.error(`Rolled back ${name} queries`)
        throw err
    } finally {
        await client.release()
    }
}

// @note Assumes the input file "stackoverfaux.json" is in the project root directory and that the data is formatted properly.
// But this file is not included in this repo, because it is meant to be secret.
const seedDatabase = async () => {
    const filepath = path.join(__dirname, "..", "stackoverfaux.json")

    const data = await fs.readFile(filepath, "utf-8")

    const json = JSON.parse(data)

    // Keep track of unique entries with maps, convert to arrays later
    const questionMap = new Map()
    const answerMap = new Map()
    const commentMap = new Map()
    const userMap = new Map()

    // Keep track of relationships for junction tables
    const questionAnswers = []
    const questionComments = []
    const questionUsers = []
    const answerComments = []
    const answerUsers = []
    const commentUsers = []

    const processComment = (comment) => {
        const { user, ...rest } = comment

        userMap[user.id] = user
        commentMap[comment.id] = rest

        commentUsers.push({ comment_id: comment.id, user_id: user.id })
    }

    const processAnswer = (answer) => {
        const { user, comments, ...rest } = answer

        userMap[user.id] = user
        answerMap[rest.id] = rest

        answerUsers.push({ answer_id: answer.id, user_id: user.id })

        for (const comment of comments) {
            processComment(comment)
            answerComments.push({ answer_id: answer.id, comment_id: comment.id })
        }
    }

    for (const question of json) {
        const { user, comments, answers, ...rest } = question

        userMap[user.id] = user
        questionMap[question.id] = rest

        questionUsers.push({ question_id: question.id, user_id: user.id })

        for (const comment of comments) {
            processComment(comment)
            questionComments.push({ question_id: question.id, comment_id: comment.id })
        }

        for (const answer of answers) {
            processAnswer(answer)
            questionAnswers.push({ question_id: question.id, answer_id: answer.id })
        }
    }

    // @todo Set up insert queries for other tables
    const questionQueries = Object.values(questionMap)
    const answerQueries = Object.values(answerMap)
    const commentQueries = Object.values(commentMap)
    const userQueries = Object.values(userMap).map((user) => {
        return `INSERT INTO users (id, name) VALUES (${user.id}, '${user.name}');`
    })

    // @todo Set up insert queries for junction tables

    await runQueriesInTransaction("user", userQueries)
}

seedDatabase()
    .then(() => {
        console.log("Finished seeding database.")
        process.exit(0)
    })
    .catch((err) => {
        console.error("Failed to see database:", err)
        process.exit(1)
    })
