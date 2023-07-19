import type { Request, Response } from "express"

import NotFound from "./errors/not-found.js"

const parseId = (req: Request) => {
    if (!req.params["id"]) {
        throw new NotFound("Question not found.")
    }

    const id = parseInt(req.params["id"], 10)

    if (isNaN(id)) {
        throw new NotFound(`Question ${id} not found.`)
    }

    return id
}

export default parseId
