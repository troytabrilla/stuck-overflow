import joi from "joi"

import debug from "debug"

const logger = debug("stuck-overflow:src:models:user")

interface IUser {
    id: number
    name: string
}

export const validator = joi.object<IUser>({
    id: joi.number().required(),
    name: joi.string().min(2).max(100).required(),
})

class User implements IUser {
    constructor(public id: number, public name: string) {}

    static validate(user: IUser) {
        const { value, error } = validator.validate(user)

        if (error) {
            logger(error)
            throw error
        }

        return value
    }
}

export default User
