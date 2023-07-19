import express from "express"
import helmet from "helmet"
import morgan from "morgan"

import router from "./router.js"
import errorHandler from "./controllers/lib/error-handler.js"

const app = express()

app.use(helmet())
app.use(morgan("tiny"))

app.use(router)

app.use(errorHandler)

const port = process.env["PORT"]

app.listen(port, () => {
    if (process.env["NODE_ENV"] === "dev") {
        console.log(`Listening on port http://localhost:${port}`)
    }
})
