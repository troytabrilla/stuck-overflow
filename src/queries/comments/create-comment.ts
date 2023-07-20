import builder from "../lib/builder.js"

import type { IComment } from "../../models/comment.js"

const createComment = (comment: IComment) => {
    return builder.insert(comment).into("comments").returning("id")
}

export default createComment
