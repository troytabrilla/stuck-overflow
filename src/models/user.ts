interface IUser {
    id: number
    name: string
}

class User implements IUser {
    constructor(public id: number, public name: string) {}

    static validate(user: IUser) {}
}

export default User
