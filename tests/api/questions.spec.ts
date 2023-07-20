import { test, expect } from "@playwright/test"

test("fetchFull - success", async ({ request }) => {
    const questionId = 68463022

    const results = await request.get(`/api/v1/questions/${questionId}/full`)
    expect(results.ok()).toBeTruthy()
    expect(results.status()).toEqual(200)

    const json = await results.json()
    expect(json.data.id).toEqual(questionId)
    expect(json.data.title).toEqual(
        "How to add strings to a list and print the list?"
    )
    expect(json.data.body).toBeTruthy()
    expect(json.data.score).toEqual(0)
    expect(json.data.creation).toBeTruthy()
    expect(json.data.user_id).toEqual(16295664)
    expect(json.data.user.name).toEqual("Bashfu")
    expect(json.data.answers).toHaveLength(1)
    expect(json.data.comments).toHaveLength(3)
})

test("fetchFull - failure - no id", async ({ request }) => {
    const questionId = ""

    const results = await request.get(`/api/v1/questions/${questionId}/full`)
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(404)
})

test("fetchFull - failure - invalid id", async ({ request }) => {
    const questionId = "a"

    const results = await request.get(`/api/v1/questions/${questionId}/full`)
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(404)

    const json = await results.json()
    expect(json.data).toEqual("NaN is not a valid ID.")
})

test("fetchFull - failure - negative id", async ({ request }) => {
    const questionId = -1

    const results = await request.get(`/api/v1/questions/${questionId}/full`)
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(404)

    const json = await results.json()
    expect(json.data).toEqual("No question found.")
})

test("fetchFull - failure - no question", async ({ request }) => {
    const questionId = 999999999

    const results = await request.get(`/api/v1/questions/${questionId}/full`)
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(404)

    const json = await results.json()
    expect(json.data).toEqual("No question found.")
})

test("fetchAll - success", async ({ request }) => {
    const results = await request.get(`/api/v1/questions`)
    expect(results.ok()).toBeTruthy()
    expect(results.status()).toEqual(200)

    const json = await results.json()
    expect(json.data).toHaveLength(30)
    expect(json.paging.total).toEqual(30)
})

test("fetchAll - success - paging", async ({ request }) => {
    const limit = await request.get(`/api/v1/questions?limit=1`)
    expect(limit.ok()).toBeTruthy()
    expect(limit.status()).toEqual(200)

    const first = await limit.json()
    expect(first.data).toHaveLength(1)
    expect(first.paging.total).toEqual(30)
    expect(first.paging.limit).toEqual(1)
    expect(first.paging.offset).toEqual(0)

    const offset = await request.get(`/api/v1/questions?limit=1&offset=1`)
    expect(offset.ok()).toBeTruthy()
    expect(offset.status()).toEqual(200)

    const second = await offset.json()
    expect(second.data).toHaveLength(1)
    expect(second.paging.total).toEqual(30)
    expect(second.paging.limit).toEqual(1)
    expect(second.paging.offset).toEqual(1)
    expect(first.data[0].id).not.toEqual(second.data[0].id)
})

test("fetchAll - success - sorting", async ({ request }) => {
    const limit = await request.get(`/api/v1/questions?sort_key=id`)
    expect(limit.ok()).toBeTruthy()
    expect(limit.status()).toEqual(200)

    const first = await limit.json()
    expect(first.data).toHaveLength(30)
    expect(first.paging.total).toEqual(30)
    expect(first.paging.sort_key).toEqual("id")
    expect(first.paging.sort_dir).toEqual("asc")

    const offset = await request.get(
        `/api/v1/questions?sort_key=id&sort_dir=desc`
    )
    expect(offset.ok()).toBeTruthy()
    expect(offset.status()).toEqual(200)

    const second = await offset.json()
    expect(second.data).toHaveLength(30)
    expect(second.paging.total).toEqual(30)
    expect(second.paging.sort_key).toEqual("id")
    expect(second.paging.sort_dir).toEqual("desc")
    expect(first.data[0].id).not.toEqual(second.data[0].id)
})

test("fetchAll - failure - invalid paging", async ({ request }) => {
    const negativeLimit = await request.get(`/api/v1/questions?limit=-1`)
    expect(negativeLimit.ok()).toBeFalsy()
    expect(negativeLimit.status()).toEqual(400)

    const negative = await negativeLimit.json()
    expect(negative.data).toEqual("Invalid API query.")

    const overLimit = await request.get(`/api/v1/questions?limit=1000`)
    expect(overLimit.ok()).toBeFalsy()
    expect(overLimit.status()).toEqual(400)

    const over = await overLimit.json()
    expect(over.data).toEqual("Invalid API query.")

    const negativeOffset = await request.get(
        `/api/v1/questions?limit=1&offset=-1`
    )
    expect(negativeOffset.ok()).toBeFalsy()
    expect(negativeOffset.status()).toEqual(400)

    const negOffset = await negativeOffset.json()
    expect(negOffset.data).toEqual("Invalid API query.")
})

test("fetchAll - failure - invalid sorting", async ({ request }) => {
    const invalidSortKey = await request.get(`/api/v1/questions?sort_key=blah`)
    expect(invalidSortKey.ok()).toBeFalsy()
    expect(invalidSortKey.status()).toEqual(400)

    const invalidKey = await invalidSortKey.json()
    expect(invalidKey.data).toEqual("Invalid API query.")

    const invalidSortDir = await request.get(
        `/api/v1/questions?sort_key=id&sort_dir=blah`
    )
    expect(invalidSortDir.ok()).toBeFalsy()
    expect(invalidSortDir.status()).toEqual(400)

    const invalidDir = await invalidSortDir.json()
    expect(invalidDir.data).toEqual("Invalid API query.")
})
