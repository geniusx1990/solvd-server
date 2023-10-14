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
    CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "password" varchar NOT NULL,
    "phonenumber" text NOT NULL UNIQUE,
    "role" text NOT NULL
    );
    `);

/*     client.query(`
    CREATE TABLE IF NOT EXISTS "tasks" (
    "id" SERIAL PRIMARY KEY,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "priority" text NOT NULL,
    "completed" text NOT NULL,
    "user_id" INTEGER, 
    FOREIGN KEY (user_id) REFERENCES users (id)
    );
    `);

    client.query(`
    CREATE TABLE IF NOT EXISTS "posts" (
    "id" SERIAL PRIMARY KEY,
    "content" text NOT NULL,
    "task_id" INTEGER, 
    FOREIGN KEY (task_id) REFERENCES tasks (id)
    );
    `);
 */


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
