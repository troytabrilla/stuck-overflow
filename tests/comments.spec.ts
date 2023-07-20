import { test, expect } from "@playwright/test"

test("create - success - question", async ({ request }) => {
    const data = {
        body: "a comment",
        user_id: 1610174,
        entity_name: "questions",
        entity_id: 68462879,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeTruthy()
    expect(results.status()).toEqual(200)

    const json = await results.json()
    expect(json.data.comment.id).toBeTruthy()
    expect(json.data.comment.body).toEqual(data.body)
    expect(json.data.comment.user_id).toEqual(data.user_id)
})

test("create - success - answer", async ({ request }) => {
    const data = {
        body: "a comment",
        user_id: 1610174,
        entity_name: "answers",
        entity_id: 68462942,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeTruthy()
    expect(results.status()).toEqual(200)

    const json = await results.json()
    expect(json.data.comment.id).toBeTruthy()
    expect(json.data.comment.body).toEqual(data.body)
    expect(json.data.comment.user_id).toEqual(data.user_id)
})

test("create - failure - no body", async ({ request }) => {
    const data = {
        user_id: 1610174,
        entity_name: "answers",
        entity_id: 68462942,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid comment.")
})

test("create - failure - invalid body", async ({ request }) => {
    const data = {
        body: "",
        user_id: 1610174,
        entity_name: "answers",
        entity_id: 68462942,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid comment.")
})

test("create - failure - no user_id", async ({ request }) => {
    const data = {
        body: "a comment",
        entity_name: "answers",
        entity_id: 68462942,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid comment.")
})

test("create - failure - invalid user_id", async ({ request }) => {
    const data = {
        body: "a comment",
        user_id: "a",
        entity_name: "answers",
        entity_id: 68462942,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid comment.")
})

test("create - failure - non-existent user_id", async ({ request }) => {
    const data = {
        body: "a comment",
        user_id: 999999999,
        entity_name: "answers",
        entity_id: 68462942,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("No user for comment.")
})

test("create - failure - no entity_name", async ({ request }) => {
    const data = {
        body: "a comment",
        user_id: 1610174,
        entity_id: 68462942,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid entity for comment.")
})

test("create - failure - invalid entity_name", async ({ request }) => {
    const data = {
        body: "a comment",
        user_id: 1610174,
        entity_name: "a",
        entity_id: 68462942,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid entity for comment.")
})

test("create - failure - no entity_id", async ({ request }) => {
    const data = {
        body: "a comment",
        user_id: 1610174,
        entity_name: "answers",
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid entity for comment.")
})

test("create - failure - invalid entity_id", async ({ request }) => {
    const data = {
        body: "a comment",
        user_id: 1610174,
        entity_name: "answers",
        entity_id: "a",
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid entity for comment.")
})

test("create - failure - non-existent entity_id", async ({ request }) => {
    const data = {
        body: "a comment",
        user_id: 1610174,
        entity_name: "answers",
        entity_id: 999999999,
    }

    const results = await request.post("/api/v1/comments", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("No answer to comment on.")
})
