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
app.get("/menu", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM menu");
        res.json(allTodos.rows)
    }
    catch (err) {
        console.error(err.message);
    }
});

// Get Supply
app.get("/supply", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM supply");
        res.json(allTodos.rows)
    }
    catch (err) {
        console.error(err.message);
    }
});

// Get Recipes
app.get("/recipes", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM recipes");
        res.json(allTodos.rows)
    }
    catch (err) {
        console.error(err.message);
    }
});

// Get Orders
app.get("/orders", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM orders");
        res.json(allTodos.rows)
    }
    catch (err) {
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

RES looks like
{
    "Total": {
        "total_revenue": 100455.6299999986
    },
    "Chocolate Chunk Cookie_1 Pc.": {
        "total_revenue": 259.3800000000003
    },
    "ChickFil-A Nuggets Grilled Combo 12Pc": {
        "total_revenue": 1946.700000000001
    },
    "ChickFil-A Chicken Sandwich Combo": {
        "total_revenue": 1624.4000000000005
    },
  }

*/
app.post("/sales-report", async (req, res) => {
    try {
        console.log("HELLO");
        const { start_date, end_date, start_time, end_time } = req.body;

        const sales_report_by_item =
            "SELECT COALESCE(menu.menu_item, 'Total') AS menu_item, COALESCE(SUM(order_items.menu_item_quantity * order_items.food_price), 0) AS total_revenue " +
            "FROM orders " +
            "JOIN menu ON 1=1 " +
            "LEFT JOIN order_items ON orders.order_id = order_items.order_id AND menu.menu_item = order_items.menu_item" +
            " WHERE orders.order_date BETWEEN $1 AND $2 " +
            "AND orders.order_time BETWEEN $3 AND $4 " +
            "GROUP BY ROLLUP(menu.menu_item);";
        console.log("Query = ", sales_report_by_item);
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
        console.log(salesReportTable);
        res.json(salesReportTable);
    } catch (err) {
        console.error(err.message);
        res.send("Server Error");
    }
});

app.post('/order', async (req, res) => {
    console.log("HI");
    const { currentOrder, order_date, order_time, customer_fname, order_creator } = req.body;
    let order_total = 0;
    for (const menuItem of currentOrder) {
        order_total += parseFloat(menuItem.food_price);
    }
    console.log("Order Total = ", order_total);
    try {
        const client = await pool.connect();
        const order_id_query = "SELECT nextval('orders_order_id_seq')";
        const order_id_result = await client.query(order_id_query);
        const order_id = order_id_result.rows[0].nextval;
        console.log("Completed order_id_query", order_id);
        const order_query = `INSERT INTO orders VALUES (${order_id}, '${order_date}', '${order_time}', ${order_total}, '${customer_fname}', ${order_creator})`;
        await client.query(order_query);
        console.log("Completed order_query", order_query);

        // Insert each item in the currentOrder list into the order_items table
        for (const item of currentOrder) {
            const item_name = item.menu_item;
            const food_price = item.food_price;
            const order_item_query = `INSERT INTO order_items VALUES (${order_id}, '${item_name}', 1, ${food_price})`;
            await pool.query(order_item_query);
            console.log("Completed order_item_query", order_item_query);
        }
        // Add any additional queries here

        await client.release();
        res.send("Order submitted successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error submitting order");
    }
});

// ///////////////////////////////////////////////////////////////////////////////////////////////////////
// MANAGER INVENTORY AND MENU QUERIES
app.delete("/menu", async (req, res) => {
    try {
        const { menu_item, food_price, combo, menu_cat } = req.body;
        const delete_menu_item = await pool.query(`DELETE FROM menu WHERE menu_item = '${menu_item}';`);
        res.json(`Menu item successfully deleted`);
    } catch (err) {
        console.error('Error deleting menu item:', err);
        res.status(500).send('Error deleting menu item');
    }
});

app.delete("/supply", async (req, res) => {
    try {
        const { ingredient, threshold, restock_quantity } = req.body;
        const delete_ingredient = await pool.query(`DELETE FROM supply WHERE ingredient = '${ingredient}';`);
        // console.log(`Deleting ${ingredient}`);
        res.json(`Supply item successfully deleted`);
    } catch (err) {
        console.error('Error deleting supply item:', err);
        res.status(500).send('Error deleting supply item');
    }
});

// Creating new menu/inventory items
app.post("/menu", async (req, res) => {
    try {
        const { menu_item, food_price, combo, menu_cat } = req.body;
        const q = `INSERT INTO menu (menu_item, menu_cat, combo, food_price)
      VALUES ('${menu_item}', '${menu_cat}', ${combo}, ${food_price});`;
        // console.log(q);
        const newItem = await pool.query(q);
        res.json(newItem.rows[0]);
    }
    catch (err) {
        console.error('Error posting new menu item:', err);
        res.status(500).send('Error posting new menu item');
    }
});

app.post("/supply", async (req, res) => {
    try {
        const { ingredient, threshold, restock_quantity } = req.body;
        const q = `INSERT INTO supply VALUES ('${ingredient}', ${threshold}, ${restock_quantity});`;
        // console.log(q);
        const newItem = await pool.query(q);
        res.json(newItem.rows[0]);
    }
    catch (err) {
        console.error('Error posting new supply item:', err);
        res.status(500).send('Error posting new supply item');
    }
});

// Updating existing items
app.put("/menu/", async (req, res) => {
    try {
        const { menu_item, food_price, combo, menu_cat } = req.body;
        const q = `
          UPDATE menu
          SET menu_cat = '${menu_cat}', food_price = ${food_price}, combo = ${combo}
          WHERE menu_item = '${menu_item}'`;
        console.log(q);
        const updateMenu = await pool.query(q);

        res.json("Menu was updated!")
    }
    catch (err) {
        console.error('Error updating menu item:', err.message);
        res.status(500).send('Error updating menu item');
    }
});

app.put("/supply/", async (req, res) => {
    try {
        const { ingredient, threshold, restock_quantity } = req.body;
        const q = `
          UPDATE supply
          SET threshold = '${threshold}', restock_quantity = ${restock_quantity}
          WHERE ingredient = '${ingredient}'`;
        console.log(q);
        const updateSupply = await pool.query(q);
        res.json("Supply was updated!")
    }
    catch (err) {
        console.error('Error updating supply item:', err.message);
        res.status(500).send('Error updating supply item');
    }
});
// ///////////////////////////////////////////////////////////////////////////////////////////////////////


export default {
    path: '/api',
    handler: app
}