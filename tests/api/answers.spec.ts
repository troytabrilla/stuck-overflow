import { test, expect } from "@playwright/test"

// @note I chose to use Playwright as the test runner for convenience. I could develop and run both unit and
// integration tests in the same framework, which is pretty nice. Anything that makes writing and running
// tests easier is a win in my book. This test suite doesn't try to go for full coverage, because that would
// take a ton of time, but I  wanted to try to handle the usual suspects, like invalid inputs at least. For a
// production app, I'd try to be more thorough. I'd also try to work with QA to see if they had any test cases
// they regularly ran that they'd like to see automated.

test("create - success", async ({ request }) => {
    const data = {
        body: "an answer",
        user_id: 1610174,
        question_id: 68462879,
    }

    const results = await request.post("/api/v1/answers", { data })
    expect(results.ok()).toBeTruthy()
    expect(results.status()).toEqual(200)

    const json = await results.json()
    expect(json.data.answer.id).toBeTruthy()
    expect(json.data.answer.body).toEqual(data.body)
    expect(json.data.answer.user_id).toEqual(data.user_id)
    expect(json.data.answer.question_id).toEqual(data.question_id)
    expect(json.data.answer.score).toEqual(0)
    expect(json.data.answer.accepted).toEqual(false)
    expect(json.data.answer.creation).toBeTruthy()
})

test("create - failure - no body", async ({ request }) => {
    const data = {
        user_id: 1610174,
        question_id: 68462879,
    }

    const results = await request.post("/api/v1/answers", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid answer.")
})

test("create - failure - invalid body", async ({ request }) => {
    const data = {
        body: "",
        user_id: 1610174,
        question_id: 68462879,
    }

    const results = await request.post("/api/v1/answers", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid answer.")
})

test("create - failure - no user_id", async ({ request }) => {
    const data = {
        body: "an answer",
        question_id: 68462879,
    }

    const results = await request.post("/api/v1/answers", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid answer.")
})

test("create - failure - invalid user_id", async ({ request }) => {
    const data = {
        body: "an answer",
        user_id: "a",
        question_id: 68462879,
    }

    const results = await request.post("/api/v1/answers", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid answer.")
})

test("create - failure - non-existent user_id", async ({ request }) => {
    const data = {
        body: "an answer",
        user_id: 999999999,
        question_id: 68462879,
    }

    const results = await request.post("/api/v1/answers", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("No user for answer.")
})

test("create - failure - no question_id", async ({ request }) => {
    const data = {
        body: "an answer",
        user_id: 1610174,
    }

    const results = await request.post("/api/v1/answers", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid answer.")
})

test("create - failure - invalid question_id", async ({ request }) => {
    const data = {
        body: "an answer",
        user_id: 1610174,
        question_id: "a",
    }

    const results = await request.post("/api/v1/answers", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("Invalid answer.")
})

test("create - failure - non-existent question_id", async ({ request }) => {
    const data = {
        body: "an answer",
        user_id: 1610174,
        question_id: 999999999,
    }

    const results = await request.post("/api/v1/answers", { data })
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(400)

    const json = await results.json()
    expect(json.data).toEqual("No question to answer.")
})
