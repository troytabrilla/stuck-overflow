import express from "express"
import morgan from "morgan"

const app = express()

app.use(morgan("tiny"))

app.get("/", (_req, res) => {
    res.json({
        data: "Hello, world",
    })
})

const port = process.env["PORT"]

app.listen(port, () => {
    if (process.env["NODE_ENV"] === "dev") {
        console.log(`Listening on port http://localhost:${port}`)
    }
})
