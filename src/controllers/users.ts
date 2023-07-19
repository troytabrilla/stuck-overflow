import type { RequestHandler } from "express"

import User from "../models/user.js"
import errorHandler from "./lib/error-handler.js"

export const fetchAll: RequestHandler = errorHandler(async (_req, res) => {
    const users = await User.fetchAll()

    res.json({
        data: users,
    })
})

export default {
    fetchAll,
}
