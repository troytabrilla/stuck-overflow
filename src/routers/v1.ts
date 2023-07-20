import express from "express"

import answers from "../controllers/answers.js"
import questions from "../controllers/questions.js"
import users from "../controllers/users.js"
import comments from "../controllers/comments.js"

const router = express.Router()

// @note API documentation is very basic for this challenge. For production, would probably want to add more details.

/**
 * @openapi
 * /answers:
 *  post:
 *      tags:
 *          - Answers
 *      summary: Create an answer to a question
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateAnswerInput'
 *      responses:
 *          200:
 *              description: Answer was successfully created
 *          400:
 *              description: Answer was not created due to invalid input
 */
router.post("/answers", answers.create)

/**
 * @openapi
 * /comments:
 *  post:
 *      tags:
 *          - Comments
 *      summary: Create a comment on a question or answer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateCommentInput'
 *      responses:
 *          200:
 *              description: Comment was successfully created
 *          400:
 *              description: Comment was not created due to invalid input
 */
router.post("/comments", comments.create)

/**
 * @openapi
 * /questions:
 *  get:
 *      tags:
 *          - Questions
 *      summary: Get a list of questions
 *      parameters:
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *              minimum: 0
 *              maximum: 100
 *          - in: query
 *            name: offset
 *            schema:
 *              type: integer
 *              minimum: 0
 *          - in: query
 *            name: sort_key
 *            schema:
 *              type: string
 *              enum:
 *                  - id
 *                  - creation
 *          - in: query
 *            name: sort_dir
 *            schema:
 *              type: string
 *              enum:
 *                  - asc
 *                  - desc
 *      responses:
 *          200:
 *              description: List of questions was fetched successfully
 *          400:
 *              description: List of questions was not fetched due bad data
 */
router.get("/questions", questions.fetchAll)

/**
 * @openapi
 * /questions/{id}/full:
 *  get:
 *      tags:
 *          - Questions
 *      summary: Get a question with its answers and comments
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              default: 68462550
 *      responses:
 *          200:
 *              description: Question with answers and comments was fetched successfully
 *          400:
 *              description: Question was not fetched due bad data
 */
router.get("/questions/:id/full", questions.fetchFull)

/**
 * @openapi
 * /users/{id}/full:
 *  get:
 *      tags:
 *          - Users
 *      summary: Get a user with their questions, answers, and comments
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              default: 14531062
 *      responses:
 *          200:
 *              description: User with questions, answers, and comments was fetched successfully
 *          400:
 *              description: User was not fetched due bad data
 */
router.get("/users/:id/full", users.fetchFull)

export default router
