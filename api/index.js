const express = require('express')
const cookieParser = require('cookie-parser');      // Login/Logout Dep's
const sessions = require('express-session');

const app = express()
const pool = require("./db");

const oneDay = 1000 * 60 * 60 * 24;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());            // Cookie Parser Middleware
app.use(sessions({                  // Session Middleware
    secret: "thisismysecretkeycoleryanwestonloganckfla5223",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

var session;                        // A variable to save a session


require('./users')(app, session);   // User login/logout & register


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

app.post("/supplyIngredient", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT ingredient FROM supply");
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

//Get all ingredients
app.post("/ingredients", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT ingredient,portion_count FROM recipes");
        res.json(allTodos.rows)
    }
    catch (err) {
        console.error(err.message);
    }
});

app.post("/itemIngredients", async (req, res) => {
    try {
        const { menu_item } = req.body;
        const allTodos = await pool.query("SELECT ingredient,portion_count FROM recipes WHERE menu_item = '" + menu_item + "';");
        res.json(allTodos.rows)
    }
    catch (err) {
        console.error(err.message);
    }
});


//updates an menu item's recipe
/**
 * updates a menu item's recipe
 * @author Ryan Paul
 * @param req - takes in the menu item to be updated, the ingredient to be added, 
 * and what portion it will take part in that item
 * @param res - confirmation that the menu item was updated
 * @return {void}
 */
app.put("/itemRecipe", async (req, res) => {
    try {
      const { menu_item, ingredient, portion_count } = req.body;
      await pool.query(
        "UPDATE recipes SET portion_count = $1 WHERE menu_item = $2 AND ingredient = $3",
        [portion_count, menu_item, ingredient]
      );
      res.send("Recipe updated successfully");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });


  app.post("/itemRecipe", async (req, res) => {
    try {
        console.log("here");
        const { menu_item, ingredient, portion_count } = req.body;
        const q = `INSERT INTO recipes (menu_item, ingredient, portion_count)
      VALUES ('${menu_item}', '${ingredient}', ${portion_count});`;
        console.log("This: ",q);
        const newItem = await pool.query(q);
        res.json(newItem.rows[0]);
    }
    catch (err) {
        console.error('Error posting new menu item:', err);
        res.status(500).send('Error posting new menu item');
    }
});
  
app.delete("/itemRecipe", async (req, res) => {
    try {
        console.log("reached delete");
        const { menu_item, ingredient} = req.body;
        const delete_recipe_item = await pool.query(`
        DELETE FROM recipes 
        WHERE menu_item = $1 AND ingredient = $2;`, [menu_item, ingredient]);
        res.json(`Menu item successfully deleted`);
    } catch (err) {
        console.error('Error deleting menu item:', err);
        res.status(500).send('Error deleting menu item');
    }
});

// Get Orders
/**
 * returns the entire history of all recorded orders in the database
 * @author Cole McAnelly
 * @param {Array} res - a json with all orders and their attributes stored
 * @return {json}
 */ 
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

/**
 * Retrieves all items that  are in excess 
 * @author Ryan Paul
 * @param req - contains a date parameter to use in query
 * @param res - all necessary information to produce excess report
 * @return {void}
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
/**
 * Retrieves all items that need to be restocked
 * @author Weston Cadena
 * @param {json} res - returns a json of all items over the restock threshold
 * @return {void}
 */ 
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
/**
 * Retrieves all necessary information to produce a slaes report
 * @author Ryan Paul
 * @param req - given the start date and time and end date and time
 * @param res - returns the revenue produced during time range
 * @return {void}
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

        res.json(salesReportTable);
    } catch (err) {
        console.error(err.message);
        res.send("Server Error");
    }
});


// Get X Report
/**
 * Retrieves all the necessary items to compute an X report
 * @author Logan Kettle
 * @param req - unused, the queries are completely independent
 * @param res - the ending date and time of the previous z report as well as
 * the sales in dollars since the last z report closed
 * @return {void}
 */
app.get('/x-report', async (req, res) => {
    try {
        
        // Query 1: get end_date
        const end_date_query = "SELECT order_date FROM orders WHERE order_id = (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
        const end_date_response = await pool.query(end_date_query);

        // Query 2: get end_time
        const end_time_query = "SELECT order_time FROM orders WHERE order_id = (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
        const end_time_response = await pool.query(end_time_query);

        // Query 3: get sales
        const sales_query = "SELECT SUM(order_total) FROM orders WHERE order_id > (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
        const sales_response = await pool.query(sales_query);

        // Return results
        res.json({
            end_date: end_date_response.rows[0],
            end_time: end_time_response.rows[0],
            sales: sales_response.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.send("Server Error");
    }

});


// Get Z Report
/**
 * Retrieves all necessary items to compute a Z report and inserts the range of orders
 * covered since last z report, inserting an entry in to the z_reports table
 * @author Logan Kettle
 * @param req - unused, same as above
 * @param res- the start and end date and time of the report to be computed as well
 * as all the sales received during that period
 * @return {void}
 */
app.get('/z-report', async (req, res) => {
    try {

        // Query 5: get sales
        const sales_query = "SELECT SUM(order_total) FROM orders WHERE order_id > (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
        const sales_response = await pool.query(sales_query);
        
        //
        await pool.query("INSERT INTO z_reports(report_id, sales, start_order_id, end_order_id) VALUES ( (SELECT (MAX(report_id) + 1) FROM z_reports), (SELECT SUM(order_total) FROM orders WHERE order_id > (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))), (SELECT (end_order_id + 1) FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports)), (SELECT MAX(order_id) FROM orders) )");

        // Query 1: get start_date
        const start_date_query = "SELECT order_date FROM orders WHERE order_id = (SELECT start_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
        const start_date_response = await pool.query(start_date_query);

        // Query 2: get start_time
        const start_time_query = "SELECT order_time FROM orders WHERE order_id = (SELECT start_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
        const start_time_response = await pool.query(start_time_query);

        // Query 3: get end_date
        const end_date_query = "SELECT order_date FROM orders WHERE order_id = (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
        const end_date_response = await pool.query(end_date_query);

        // Query 4: get end_time
        const end_time_query = "SELECT order_time FROM orders WHERE order_id = (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
        const end_time_response = await pool.query(end_time_query);
        
        

        // Return results
        res.json({
            start_date: start_date_response.rows[0],
            end_date: end_date_response.rows[0],
            start_time: start_time_response.rows[0],
            end_time: end_time_response.rows[0],
            sales: sales_response.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.send("Server Error");
    }

});




/**
 *  Loops through a list of ordered items and inserts them into the orders table in the database
 * @author Cole McAnelly
 * @param req - passes in all the attributes of the orders
 * @param res - confirmation that order was submitted
 * @return {void}
 */ 
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

/**
 * Deletes a menu_item from the menu table in database
 * @author Ryan Paul
 * @param req - All specifications for the menu item to be deleted
 * @param res - Confirmation that menu item was deleted
 * @return {void}
 */ 
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

/**
 * Removes a particular ingredient from the database 
 * @author Ryan Paul
 * @param req - specifications for ingredient to remove
 * @param res - confirmation that ingredient was removed
 * @return {void}
 */ 
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
/**
 * Inserts new menu item by adding to database
 * @author Weston Cadena
 * @paramreq - passes in specfications of the new menu item
 * @param {json} res - returns json of the item that was inserted into the database
 * @return {void}
 */ 
app.post("/menu", async (req, res) => {
    try {
        const { menu_item, food_price, combo, menu_cat } = req.body;
        const q = `INSERT INTO menu (menu_item, menu_cat, combo, food_price)
      VALUES ('${menu_item}', '${menu_cat}', '${combo}', ${food_price});`;
        // console.log(q);
        const newItem = await pool.query(q);
        res.json(newItem.rows[0]);
    }
    catch (err) {
        console.error('Error posting new menu item:', err);
        res.status(500).send('Error posting new menu item');
    }
});

/**
 * Inserts new menu or inventory item into their respective tables
 * @author Weston Cadena
 * @param req - passes in specfications of the new ingredient
 * @param {json} res - returns the ingredient that was inserted into the databse as json
 * @return {void}
 */ 
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
/**
 * Updates menu item within database table
 * @author Ryan Paul
 * @param req - passes in updated specfications of the menu item
 * @param  res - confirmation that menu item was updated
 * @return {void}
 */ 
app.put("/menu", async (req, res) => {
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

/**
 * Updates ingredient within supplydatabase table
 * @author Ryan Paul
 * @param req - passes in updated specfications of the ingredient
 * @param  res - confirmation that supply ingredient was updated
 * @return {void}
 */ 
app.put("/supply", async (req, res) => {
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

// ///////////////////////////////////////////////////////////////////////////////////////////////////////

export default {
    path: '/api',
    handler: app
}