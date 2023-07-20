import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

import type { Express, Request, Response } from "express"

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Stuck Overflow API Docs",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
            },
        ],
    },
    apis: ["./src/routers/v1.ts", "./src/models/*.ts"],
}

const spec = swaggerJsDoc(options)

const docs = (app: Express) => {
    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(spec))

    app.get("/public/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")
        res.send(spec)
    })
}

export default docs
