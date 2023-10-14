const { Client } = require("pg");
const client = new Client({
    /*  user: 'library_tnws_user',
     host: 'dpg-ck0qg3hjbtgs73ck3kgg-a',
     database: 'library_tnws',
     password: '9w0fl8zGbpwBb3kg4cQ30mK4NLQd9yPj',
     port: 5432, */


    user: 'me',
    host: 'localhost',
    database: 'october',
    password: 'password',
    port: 5432,
})


module.exports = client;