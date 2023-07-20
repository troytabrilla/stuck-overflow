import { test, expect } from "@playwright/test"
import "dotenv/config"

import Question from "../../dist/models/question.js"

test("validate - valid", () => {
    const valid = {
        id: 68462550,
        title: "title",
        body: "body",
        score: 0,
        creation: new Date(),
        user_id: 16139854,
    }
    expect(Question.validate(valid)).toBeTruthy()
})

test("validate - invalid", () => {
    const invalid = {
        id: -1,
        title: "",
        body: "",
        score: 0,
        creation: new Date(),
        user_id: -1,
    }
    expect(() => Question.validate(invalid)).toThrow("Invalid question.")
})

test("build - valid", () => {
    const valid = {
        id: 68462550,
        title: "title",
        body: "body",
        score: 0,
        creation: new Date(),
        user_id: 16139854,
    }
    expect(Question.build(valid)).toBeTruthy()
})

test("build - invalid", () => {
    const invalid = {
        id: -1,
        title: "",
        body: "",
        score: 0,
        creation: new Date(),
        user_id: -1,
    }
    expect(() => Question.build(invalid)).toThrow("Invalid question.")
})

test("fetch - valid", async () => {
    const valid = 68463043
    const question = await Question.fetch(valid)
    expect(question).toBeTruthy()
    expect((question as Question).id).toEqual(valid)
})

test("fetch - invalid", async () => {
    const invalid = 999999999
    const question = await Question.fetch(invalid)
    expect(question).toBeNull()
})

test("fetchAll", async () => {
    const questions = await Question.fetchAll()
    expect(questions).toHaveLength(30)
})

test("countAll", async () => {
    const count = await Question.countAll()
    expect(count).toEqual(30)
})

test("fetchAllFor - valid", async () => {
    const valid = 10339394
    const questions = await Question.fetchAllFor("users", valid)
    expect(questions).toHaveLength(1)
})

test("fetchAllFor - invalid", async () => {
    const invalid = 999999999
    const questions = await Question.fetchAllFor("users", invalid)
    expect(questions).toHaveLength(0)
})
