import { test, expect } from "@playwright/test"

test("fetchFull - success", async ({ request }) => {
    const userId = 16295664

    const results = await request.get(`/api/v1/users/${userId}/full`)
    expect(results.ok()).toBeTruthy()
    expect(results.status()).toEqual(200)

    const json = await results.json()
    expect(json.data.id).toEqual(userId)
    expect(json.data.name).toEqual("Bashfu")
    expect(json.data.questions).toHaveLength(1)
    expect(json.data.answers).toHaveLength(0)
    expect(json.data.comments).toHaveLength(2)
})

test("fetchFull - failure - no id", async ({ request }) => {
    const userId = ""

    const results = await request.get(`/api/v1/users/${userId}/full`)
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(404)
})

test("fetchFull - failure - invalid id", async ({ request }) => {
    const userId = "a"

    const results = await request.get(`/api/v1/users/${userId}/full`)
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(404)

    const json = await results.json()
    expect(json.data).toEqual("NaN is not a valid ID.")
})

test("fetchFull - failure - negative id", async ({ request }) => {
    const userId = -1

    const results = await request.get(`/api/v1/users/${userId}/full`)
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(404)

    const json = await results.json()
    expect(json.data).toEqual("No user found.")
})

test("fetchFull - failure - no user", async ({ request }) => {
    const userId = 999999999

    const results = await request.get(`/api/v1/users/${userId}/full`)
    expect(results.ok()).toBeFalsy()
    expect(results.status()).toEqual(404)

    const json = await results.json()
    expect(json.data).toEqual("No user found.")
})
