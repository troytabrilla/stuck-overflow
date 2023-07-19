import type { ErrorRequestHandler } from "express"

// @note A catch-all error handler for the main Express application. In production, this should have a better error
// message and provide better logging for investigations and logging, but I decided to forgo those for now to focus
// on other functionality.
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error("API Error:", err)

    res.status(500).send("Whoops, we'll look into this.")
}

export default errorHandler
