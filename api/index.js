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
// app.get("/orders", async (req,res) => {
//     try{
//         const {order_id, order_num, order_date, order_time, order_total, customer_name, kiosk_id} = req.body;
//         const newTodo = await pool.query (
//           "INSERT INTO orders (order_id, order_num, order_date, order_time, order_total, customer_name, kiosk_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
//           [order_id, order_num, order_date, order_time, order_total, customer_name, kiosk_id]
//         );
//     }
//     catch (err){
//         console.error(err.message);
//     }
// });

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

// Get Excess Report
/*
MUST Pass in a json file like this 

{
  "date": "2023-4-12"
}

*/
app.post("/excess-report", async (req, res) => {
    console.log("Hello");
    try {
      const { date } = req.body;
      const query = `WITH cte AS (
          SELECT 
              ingredient, 
              qty_sod, 
              SUM(qty_sold) as total_qty_sold, 
              ((qty_sod - SUM(qty_sold))/qty_sod)*100 as percentage_diff
          FROM 
              daily_inventory
          WHERE 
              entry_date >= '${date}' 
          GROUP BY 
              ingredient, qty_sod
      )
      SELECT 
          ingredient, 
          qty_sod, 
          total_qty_sold, 
          percentage_diff
      FROM 
          cte
      WHERE 
          percentage_diff > 90;`;
  
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// Get Restock Report
app.get('/restock-report', async (req, res) => {
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


// Get Sales Report
/*
MUST Pass in a json file like this 

{
  {
  "start_date": "2023-04-01",
  "end_date": "2023-04-12",
  "start_time": "06:00:00",
  "end_time": "22:30:00"
  }
}
*/
app.post("/sales-report", async (req, res) => {
    try {
      const { start_date, end_date, start_time, end_time } = req.body;
  
      const sales_report_by_item =
        "SELECT COALESCE(menu.menu_item, 'Total') AS menu_item, COALESCE(SUM(order_items.menu_item_quantity * order_items.food_price), 0) AS total_revenue " +
        "FROM orders " +
        "JOIN menu ON 1=1 " +
        "LEFT JOIN order_items ON orders.order_id = order_items.order_id AND menu.menu_item = order_items.menu_item" +
        " WHERE orders.order_date BETWEEN $1 AND $2 " +
        "AND orders.order_time BETWEEN $3 AND $4 " +
        "GROUP BY ROLLUP(menu.menu_item);";
  
      const { rows } = await pool.query(sales_report_by_item, [
        start_date,
        end_date,
        start_time,
        end_time,
      ]);
  
      const salesReportTable = {};
  
      for (let row of rows) {
        salesReportTable[row.menu_item] = {
          total_revenue: row.total_revenue,
        };
      }
  
      res.json(salesReportTable);
    } catch (err) {
      console.error(err.message);
      res.send("Server Error");
    }
  });




export default {
  path: '/api',
  handler: app
}