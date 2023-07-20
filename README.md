# Stuck Overflow

An API to help developers hopelessly stuck on some problem that someone somewhere in the world probably has an amazing solution for.

## Setup

To run, please copy the `stackoverfaux.json` file to the root directory of this project, then run `docker-compose up`. Docker Compose should set up PostgreSQL, run migrations, seed the database with sample data, and start the API server on port 3000. Visit http://localhost:3000/api/v1/docs to view the API documentation.

For a more manual setup with an existing PostgreSQL server running locally, you can use `npm run setup-db` to run the migrations and seed the database.

## Notes

I decided to focus on the data models and API for this challenge, so I did not include a UI. For a production app, I would probably opt to add one as a separate service from this API, which could provide more flexibility in choosing what tech stack would drive it.
