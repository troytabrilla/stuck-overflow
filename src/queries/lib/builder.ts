import knex from "knex"

// @note I chose to use a query builder to standardize the way queries are built,
// rather than just using raw string queries, which may easy to mess up.
// The knex library, in particular, also supports connections to databases under
// the hood, but I had already set up the database connection, so I didn't want
// to go back and change it for this challenge due to time constraints. For an
// actual production app, using knex as the database manager may be a consideration,
// depending on what it provides vs the complexity it brings.
const builder = knex({ client: "pg" })

export default builder
