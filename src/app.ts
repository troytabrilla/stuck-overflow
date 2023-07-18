import express from "express"

import "dotenv/config"

const app = express()

app.get("/", (_req, res) => {
    res.json({
        data: "Hello, world",
    })
})

const port = process.env["PORT"]

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})
