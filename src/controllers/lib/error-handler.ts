import type { RequestHandler, Request, Response, NextFunction } from "express"

const errorHandler = (middleware: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(middleware(req, res, next)).catch(next)
    }
}

export default errorHandler
