import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import bodyParser from "body-parser"

import v1Router from "./routers/v1.js"
import apiDocs from "./docs/swagger.js"

import apiErrorHandler from "./controllers/lib/api-error-handler.js"

const app = express()

app.use(helmet())
app.use(morgan("tiny"))
app.use(bodyParser.json())

// Playwright pings the root endpoint as a sort of health check, so just send a 200 back.
app.get("/", (_req, res) => {
    res.status(200).send("OK")
})

// @note These routes should be authorized and authenticated. For production, you could use something like OAuth or some
// other third party auth service, but for this challenge, I decided to omit this functionality, because it can take some
// time to get just right.
app.use("/api/v1", v1Router)

apiDocs(app)

app.use(apiErrorHandler)

const port = process.env["PORT"]

app.listen(port, () => {
    if (process.env["NODE_ENV"] === "dev") {
        console.log(`Listening on port http://localhost:${port}`)
    }
})
