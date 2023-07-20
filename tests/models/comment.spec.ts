import { test, expect } from "@playwright/test"
import "dotenv/config"

import Comment from "../../dist/models/comment.js"

test("validate - valid", () => {
    const valid = {
        body: "a comment",
        user_id: 15954539,
        id: 1,
    }
    expect(Comment.validate(valid)).toBeTruthy()
})

test("validate - invalid", () => {
    const invalid = {
        body: "",
        user_id: -1,
        id: -1,
    }
    expect(() => Comment.validate(invalid)).toThrow("Invalid comment.")
})

test("build - valid", () => {
    const valid = {
        body: "a comment",
        user_id: 15954539,
        id: 1,
    }
    expect(Comment.build(valid)).toBeInstanceOf(Comment)
})

test("build - invalid", () => {
    const invalid = {
        body: "",
        user_id: -1,
        id: -1,
    }
    expect(() => Comment.build(invalid)).toThrow("Invalid comment.")
})

test("fetchAllFor - valid", async () => {
    const valid = 68462872
    await expect(Comment.fetchAllFor("questions", valid)).resolves.toHaveLength(
        1
    )
})

test("fetchAllFor - invalid", async () => {
    const invalid = 999999999
    await expect(
        Comment.fetchAllFor("questions", invalid)
    ).resolves.toHaveLength(0)
})

test("createFor - valid", async () => {
    const entityName = "questions"
    const entityId = 68462912
    const valid = {
        body: "a comment",
        user_id: 2536611,
        id: undefined as any,
    }

    const comment = await Comment.createFor(valid, entityName, entityId)
    expect(comment.id).toBeTruthy()
    expect(comment.body).toEqual(valid.body)
    expect(comment.user_id).toEqual(valid.user_id)
})

test("createFor - invalid", async () => {
    const entityName = "questions"
    const entityId = 68462912
    const invalid = {
        body: "",
        user_id: -1,
        id: undefined as any,
    }
    await expect(
        Comment.createFor(invalid, entityName, entityId)
    ).rejects.toThrow("Invalid comment.")
})

test("createFor - no question", async () => {
    const entityName = "questions"
    const entityId = 999999999
    const valid = {
        body: "a comment",
        user_id: 68462912,
        id: undefined as any,
    }
    await expect(
        Comment.createFor(valid, entityName, entityId)
    ).rejects.toThrow("No question to comment on.")
})

test("createFor - no answer", async () => {
    const entityName = "answers"
    const entityId = 999999999
    const valid = {
        body: "a comment",
        user_id: 68462912,
        id: undefined as any,
    }
    await expect(
        Comment.createFor(valid, entityName, entityId)
    ).rejects.toThrow("No answer to comment on.")
})
