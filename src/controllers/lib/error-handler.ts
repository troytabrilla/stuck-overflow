import type { ErrorRequestHandler } from "express"

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error("API Error:", err)

    res.status(500).send("Whoops, we'll look into this.")
}

export default errorHandler
