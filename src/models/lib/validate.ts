import joi from "joi"
import debug from "debug"

const logger = debug("stuck-overflow:src:models:lib:validate")

function validate<T>(data: T, validator: joi.ObjectSchema<T>) {
    const { value, error } = validator.validate(data)

    // @note This logger is really a placeholder for a more robust logging system. The one I've used before was Rollbar,
    // but there are many options out there that could be used if this were to actually go to production.
    if (error) {
        logger("Invalid model:", error)
        throw error
    }

    return value
}

export default validate
