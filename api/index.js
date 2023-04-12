// api/index.js

const express = require('express')

const app = express()
const pool = require("./db");
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/test', function (req, res) {
  res.send('Test successful')
});

// Get Menu
app.get("/menu", async (req,res) => {
    try{
        const allTodos = await pool.query("SELECT * FROM menu");
        res.json(allTodos.rows)
    }
    catch (err){
        console.error(err.message);
    }
});

// Get Supply
app.get("/supply", async (req,res) => {
  try{
      const allTodos = await pool.query("SELECT * FROM supply");
      res.json(allTodos.rows)
  }
  catch (err){
      console.error(err.message);
  }
});

// Get Recipes
app.get("/recipes", async (req,res) => {
  try{
      const allTodos = await pool.query("SELECT * FROM recipes");
      res.json(allTodos.rows)
  }
  catch (err){
      console.error(err.message);
  }
});

// Get Orders
app.get("/orders", async (req,res) => {
  try{
      const allTodos = await pool.query("SELECT * FROM orders");
      res.json(allTodos.rows)
  }
  catch (err){
      console.error(err.message);
  }
});

// Get Restock Report
app.get('/restock_report', async (req, res) => {
  try {
      const restock_report = `
          SELECT 
              today.ingredient AS ingredient, 
              today.qty_curr AS quantity, 
              supply.threshold AS threshold 
          FROM 
              (
                  SELECT DISTINCT ON (ingredient) 
                      ingredient, 
                      qty_eod AS qty_curr 
                  FROM 
                      daily_inventory 
                  ORDER BY 
                      ingredient, entry_date DESC
              ) AS today 
              INNER JOIN supply 
                  ON today.ingredient = supply.ingredient AND supply.threshold >= today.qty_curr;
      `;
      const result = await pool.query(restock_report);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching restock report:', error);
      res.status(500).send('Error fetching restock report');
  }
});




export default {
  path: '/api',
  handler: app
}