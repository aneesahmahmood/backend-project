# Northcoders News API

Northcoders News API enables the accessing of data programatically. It is mimicing a real world backend service to provide information to the front end architecture. You can find the hosted version here (insert link when complete)

## Getting Started

1. Git clone - https://github.com/aneesahmahmood/backend-project

2. Install dependencies

   - npm i

3. Create the database and seed

   - npm run setup-dbs
   - npm run seed

4. Running the tests

   - npm run test

5. Create a `.env.development` and a `.env.test` file in the root directory of the project.
   Within the .env.development file, create the following: 'PGDATABASE=nc_news'.
   Within the test file create: 'PGDATABASE=nc_news_test'.

## Note: You will need:

- Node.js: v20.0.0 or higher
- PostgreSQL: v16.1.0 or higher
