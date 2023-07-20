import builder from "../lib/builder.js"

import { addPaging, type Paging } from "../lib/paging.js"
import { addSorting, type Sorting } from "../lib/sorting.js"

const fetchAllQuestions = (paging?: Paging, sorting?: Sorting) => {
    let query = builder.select("*").from("questions")

    if (paging) {
        query = addPaging(query, paging)
    }

    if (sorting) {
        query = addSorting(query, sorting)
    }

    return query
}

export default fetchAllQuestions
