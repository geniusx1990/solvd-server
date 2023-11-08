const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const cors = require("cors");
const client = require('./configs/database');
const v1Router = require('./router/v1')
const app = express()
app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/api', v1Router);

async function startApp() {
  try {
    await client.connect();
    const sqlScript = fs.readFileSync('schema.sql', 'utf8');
//  const insertDataSql = fs.readFileSync('data.sql', 'utf8');
    await client.query(sqlScript);

    console.log("database connected and table created");
  /*   await client.query(insertDataSql);
    console.log("Data inserted"); */

  } catch (e) {
    console.log(e)
  }
}

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
startApp()