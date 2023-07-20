import { test, expect } from "@playwright/test"
import "dotenv/config"

import User from "../../dist/models/user.js"

test("validate - valid", () => {
    const valid = {
        id: 1,
        name: "name",
    }
    expect(User.validate(valid)).toBeTruthy()
})

test("validate - invalid", () => {
    const invalid = {
        id: -1,
        name: "",
    }
    expect(() => User.validate(invalid)).toThrow("Invalid user.")
})

test("build - valid", () => {
    const valid = {
        id: 1,
        name: "name",
    }
    expect(User.build(valid)).toBeTruthy()
})

test("build - invalid", () => {
    const invalid = {
        id: -1,
        name: "",
    }
    expect(() => User.build(invalid)).toThrow("Invalid user.")
})

test("fetch - valid", async () => {
    const valid = 16490359
    const user = await User.fetch(valid)
    expect(user).toBeTruthy()
    expect((user as User).id).toEqual(valid)
})

test("fetch - invalid", async () => {
    const invalid = 999999999
    const user = await User.fetch(invalid)
    expect(user).toBeNull()
})
