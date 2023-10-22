const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const client = require('./configs/database');
const userRouter = require("./router/userRouter");
const authRouter = require("./router/authRoutes");
const markRouter = require("./router/markRouter");
const modelRouter = require("./router/modelRouter");
const vehicleRouter = require("./router/vehicleRouter");
const orderRouter = require("./router/orderRouter");
const partRouter = require("./router/partRouter");

const app = express()
app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/api', userRouter);
app.use('/api', markRouter);
app.use('/api', modelRouter);
app.use('/api', vehicleRouter);
app.use('/api', partRouter);
app.use('/api', orderRouter);
app.use('/auth', authRouter);

async function startApp() {
  try {
    await client.connect();

    client.query(`
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('Admin', 'User');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('confirmed', 'in progress', 'finished');
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

    CREATE TABLE IF NOT EXISTS "marks" (
      "id" SERIAL PRIMARY KEY,
      "mark" text
    );

    CREATE TABLE IF NOT EXISTS "models" (
      "id" SERIAL PRIMARY KEY,
      "model" text
    );

    CREATE TABLE IF NOT EXISTS "vehicle" (
      "id" SERIAL PRIMARY KEY, 
      "mark_id" INTEGER,
      "model_id" INTEGER,
      "vehicle_year" INTEGER,
      FOREIGN KEY (mark_id) REFERENCES marks (id),
      FOREIGN KEY (model_id) REFERENCES models (id)
    );

    CREATE TABLE IF NOT EXISTS "parts" (
      "id" SERIAL PRIMARY KEY, 
      "part_name" text, 
      "description" text,
      "price" MONEY,
      "availability" BOOLEAN,
      "repair_cost" MONEY,
      "repair_time" interval,
      "vehicle_id" int,
      FOREIGN KEY (vehicle_id) REFERENCES vehicle (id)
    );

    CREATE TABLE IF NOT EXISTS "orders" (
      "id" SERIAL PRIMARY KEY, 
      "order_date" DATE, 
      "status" order_status,
      "user_id" INT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS "order_parts" (
      "id" SERIAL PRIMARY KEY, 
      "order_id" INTEGER, 
      "part_id" INTEGER,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (part_id) REFERENCES parts (id)
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
