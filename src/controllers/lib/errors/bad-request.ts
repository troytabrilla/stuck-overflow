import CustomError from "./custom-error.js"

class BadRequest extends CustomError {
    constructor(message: string) {
        super(message, 400)
    }
}

export default BadRequest
