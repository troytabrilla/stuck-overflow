import type { RequestHandler, Request, Response, NextFunction } from "express"

// Basically a try-catch async request handlers
const errorHandler = (middleware: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(middleware(req, res, next)).catch(next)
    }
}

export default errorHandler
