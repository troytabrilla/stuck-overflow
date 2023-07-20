import { test, expect } from "@playwright/test"
import "dotenv/config"

import Answer from "../../dist/models/answer.js"

test("validate - valid", () => {
    const valid = {
        score: 0,
        accepted: false,
        creation: new Date(),
        body: "This is an answer.",
        user_id: 14531062,
        question_id: 68462964,
        id: 31,
    }
    expect(Answer.validate(valid)).toBeTruthy()
})

test("validate - invalid", () => {
    const invalid = {
        score: 0,
        accepted: false,
        creation: new Date(),
        body: "",
        user_id: -1,
        question_id: -1,
        id: -1,
    }
    expect(() => Answer.validate(invalid)).toThrow("Invalid answer.")
})

test("build - valid", () => {
    const valid = {
        score: 0,
        accepted: false,
        creation: new Date(),
        body: "This is an answer.",
        user_id: 14531062,
        question_id: 68462964,
        id: 31,
    }
    expect(Answer.build(valid)).toBeInstanceOf(Answer)
})

test("build - invalid", () => {
    const invalid = {
        score: 0,
        accepted: false,
        creation: new Date(),
        body: "",
        user_id: -1,
        question_id: -1,
        id: -1,
    }
    expect(() => Answer.build(invalid)).toThrow("Invalid answer.")
})

test("fetchAllFor - valid", async () => {
    const valid = 68462918
    await expect(Answer.fetchAllFor("questions", valid)).resolves.toHaveLength(
        2
    )
})

test("fetchAllFor - invalid", async () => {
    const invalid = 999999999
    await expect(
        Answer.fetchAllFor("questions", invalid)
    ).resolves.toHaveLength(0)
})

test("create - valid", async () => {
    const valid = {
        score: 0,
        accepted: false,
        creation: new Date(),
        body: "This is an answer.",
        user_id: 14531062,
        question_id: 68462964,
        id: undefined as any,
    }
    const answer = await Answer.create(valid)
    expect(answer.id).toBeTruthy()
    expect(answer.score).toEqual(valid.score)
    expect(answer.accepted).toEqual(valid.accepted)
    expect(answer.creation).toEqual(valid.creation)
    expect(answer.body).toEqual(valid.body)
    expect(answer.user_id).toEqual(valid.user_id)
    expect(answer.question_id).toEqual(valid.question_id)
})

test("create - invalid", async () => {
    const invalid = {
        score: 0,
        accepted: false,
        creation: new Date(),
        body: "",
        user_id: -1,
        question_id: -1,
        id: -1,
    }
    await expect(Answer.create(invalid)).rejects.toThrow("Invalid answer.")
})

test("create - no user", async () => {
    const noUser = {
        score: 0,
        accepted: false,
        creation: new Date(),
        body: "This is an answer.",
        user_id: 999999999,
        question_id: 68462964,
        id: undefined as any,
    }
    await expect(Answer.create(noUser)).rejects.toThrow("No user for answer.")
})

test("create - no question", async () => {
    const noQuestion = {
        score: 0,
        accepted: false,
        creation: new Date(),
        body: "This is an answer.",
        user_id: 14531062,
        question_id: 999999999,
        id: undefined as any,
    }
    await expect(Answer.create(noQuestion)).rejects.toThrow(
        "No question to answer."
    )
})
