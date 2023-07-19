import type { Request, Response } from "express"

import NotFound from "./errors/not-found.js"

const parseId = (req: Request) => {
    if (!req.params["id"]) {
        throw new NotFound("No ID provided.")
    }

    const id = parseInt(req.params["id"], 10)

    if (isNaN(id)) {
        throw new NotFound(`${id} is not a valid ID.`)
    }

    return id
}

export default parseId
