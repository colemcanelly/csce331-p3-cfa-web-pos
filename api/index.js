// api/index.js

const express = require('express')

const app = express()
const pool = require("./db");
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/test', function (req, res) {
  res.send('Test successful')
});

app.get("/menu", async (req,res) => {
    try{
        const allTodos = await pool.query("SELECT * FROM menu");
        res.json(allTodos.rows)
    }
    catch (err){
        console.error(err.message);
    }
});

export default {
  path: '/api',
  handler: app
}