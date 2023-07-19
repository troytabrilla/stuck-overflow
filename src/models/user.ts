import joi from "joi"

import validate from "./lib/validate.js"

interface IUser {
    id: number
    name: string
}

const validator = joi.object<IUser>({
    id: joi.number().required(),
    name: joi.string().min(2).max(100).required(),
})

// @note Currently, all the other tables belong to users, so the user table may be joined to them often. If performance
// becomes an issue, one option to speed up queries would be to denormalize the user name into the other tables and
// avoid joins to the users table altogether. However, this should be considered after performance benchmarks are
// found to be unsatisfactory, so I decided to keep all the data normalized for now.
class User implements IUser {
    id: number
    name: string

    constructor(user: IUser) {
        this.id = user.id
        this.name = user.name
    }

    static validate(user: IUser) {
        return validate(user, validator)
    }

    static build(user: IUser) {
        const validated = User.validate(user)
        return new User(validated)
    }
}

export default User
