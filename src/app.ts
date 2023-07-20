import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import bodyParser from "body-parser"

import router from "./router.js"
import apiErrorHandler from "./controllers/lib/api-error-handler.js"

const app = express()

app.use(helmet())
app.use(morgan("tiny"))
app.use(bodyParser.json())

// @note These routes should be authorized and authenticated. For production, you could use something like OAuth, but
// for this challenge, I decided to omit this functionality.
app.use("/api/v1", router)

app.use(apiErrorHandler)

const port = process.env["PORT"]

app.listen(port, () => {
    if (process.env["NODE_ENV"] === "dev") {
        console.log(`Listening on port http://localhost:${port}`)
    }
})
