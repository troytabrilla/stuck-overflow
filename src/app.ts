import express from "express"
import helmet from "helmet"
import morgan from "morgan"

import router from "./router.js"
import catchAllErrorHandler from "./controllers/lib/catch-all-error-handler.js"

const app = express()

app.use(helmet())
app.use(morgan("tiny"))

app.use("/api/v1", router)

app.use(catchAllErrorHandler)

const port = process.env["PORT"]

app.listen(port, () => {
    if (process.env["NODE_ENV"] === "dev") {
        console.log(`Listening on port http://localhost:${port}`)
    }
})
