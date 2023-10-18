const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const client = require('./configs/database');
const userRouter = require("./router/router");
const authRouter = require("./router/authRoutes")

const app = express()
app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/api', userRouter)
app.use('/auth', authRouter)
async function startApp() {
  try {
    await client.connect();

    client.query(`
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('Admin', 'User');
        END IF;
    END $$;
    `);

    client.query(`
    CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "password" varchar NOT NULL,
    "phonenumber" text NOT NULL UNIQUE,
    "role" user_role
    );
    `);


    console.log("database connected and table created");
  } catch (e) {
    console.log(e)
  }
}


app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
startApp()
