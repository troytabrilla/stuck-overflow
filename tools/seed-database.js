import fs from "fs/promises"
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { pool } from "../dist/db/postgres.js"
import builder from "../dist/queries/lib/builder.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

const runSeedQueries = async (queries) => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // Check if database has already been seeded
        const results = await client.query(builder.count().from("users").toString())
        if (results?.rows[0]?.count > 0) {
            console.log("Database already seeded.")
            await client.query("COMMIT")
            return
        }

        await Promise.all(queries.map((query) => client.query(query)))
        await client.query("COMMIT")

        console.log(`Committed queries`)
    } catch (err) {
        await client.query("ROLLBACK")

        console.error(`Rolled back queries`)

        throw err
    } finally {
        await client.release()
    }
}

const mapToInsertQueryString = (table) => (data) => {
    return builder.insert(data).into(table).toString()
}

const timestampToDateString = (timestamp) => {
    return (new Date(timestamp * 1000)).toISOString()
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
    const questionComments = []
    const answerComments = []

    const processComment = (comment) => {
        const { user, ...rest } = comment

        userMap[user.id] = user
        commentMap[comment.id] = {
            ...rest,
            user_id: user.id
        }
    }

    const processAnswer = (answer, question) => {
        const { user, comments, ...rest } = answer

        userMap[user.id] = user
        answerMap[rest.id] = {
            ...rest,
            user_id: user.id,
            question_id: question.id,
            creation: timestampToDateString(rest.creation)
        }

        for (const comment of comments) {
            processComment(comment)
            answerComments.push({ answer_id: answer.id, comment_id: comment.id })
        }
    }

    for (const question of json) {
        const { user, comments, answers, ...rest } = question

        userMap[user.id] = user
        questionMap[question.id] = {
            ...rest,
            user_id: user.id,
            creation: timestampToDateString(rest.creation)
        }

        for (const comment of comments) {
            processComment(comment)
            questionComments.push({ question_id: question.id, comment_id: comment.id })
        }

        for (const answer of answers) {
            processAnswer(answer, question)
        }
    }

    const userQueries = Object.values(userMap).map(mapToInsertQueryString("users"))
    const questionQueries = Object.values(questionMap).map(mapToInsertQueryString("questions"))
    const answerQueries = Object.values(answerMap).map(mapToInsertQueryString("answers"))
    const commentQueries = Object.values(commentMap).map(mapToInsertQueryString("comments"))
    const questionCommentQueries = questionComments.map(mapToInsertQueryString("question_comments"))
    const answerCommentQueries = answerComments.map(mapToInsertQueryString("answer_comments"))

    const queries = [
        ...userQueries,
        ...questionQueries,
        ...answerQueries,
        ...commentQueries,
        ...questionCommentQueries,
        ...answerCommentQueries
    ]

    await runSeedQueries(queries)
}

// @note Again, better logging and error handling would be a plus, but I didn't want to devote too much time on
// this part for this challenge.
seedDatabase()
    .then(() => {
        console.log("Finished seeding database.")
        process.exit(0)
    })
    .catch((err) => {
        console.error("Failed to seed database:", err)
        process.exit(1)
    })
