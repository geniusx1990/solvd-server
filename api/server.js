const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const cors = require("cors");
const client = require('./configs/database');
const userRouter = require("./router/userRouter");
const authRouter = require("./router/authRoutes");
const markRouter = require("./router/markRouter");
const vehicleRouter = require("./router/vehicleRouter");
const orderRouter = require("./router/orderRouter");
const partRouter = require("./router/partRouter");
const orderPartsRouter = require("./router/orderPartsRouter");
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
app.use('/api', vehicleRouter);
app.use('/api', partRouter);
app.use('/api', orderRouter);
app.use('/api', orderPartsRouter);
app.use('/api/auth', authRouter);

async function startApp() {
  try {
    await client.connect();
    const sqlScript = fs.readFileSync('schema.sql', 'utf8');
    await client.query(sqlScript);

    console.log("database connected and table created");
  } catch (e) {
    console.log(e)
  }
}

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
startApp()