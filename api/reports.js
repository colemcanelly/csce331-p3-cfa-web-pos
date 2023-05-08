/* Express Routing for Reports */
module.exports = (app, pool) => {

    // Excess Report
    /**
     *@overview This file contains utility functions for our reports page.
     * Retrieves all items that are in excess
     * @author Ryan Paul
     * @param req - contains a date parameter to use in query
     * @param res - all necessary information to produce excess report
     * @return {void}
     */
    app.post("/excess-report", async (req, res) => {
        console.log("Hello");
        try {
            const { date } = req.body;
            const query = `
            WITH cte AS (
                SELECT 
                  ingredient, 
                  qty_sod,
                  ((qty_sod - (
                    SELECT SUM(qty_sold) 
                    FROM daily_inventory 
                    WHERE entry_date >= '${date}' AND ingredient = di.ingredient
                  ))/qty_sod)*100 as percentage_diff
                FROM 
                  daily_inventory di
                WHERE 
                  entry_date = '${date}' 
              )
              SELECT 
                ingredient, 
                qty_sod, 
                ((SELECT SUM(qty_sold) 
                  FROM daily_inventory 
                  WHERE entry_date >= '${date}' AND ingredient = cte.ingredient)
                 ) as total_qty_sold, 
                percentage_diff
              FROM 
                cte
              WHERE 
                percentage_diff > 90;
            `;

            const result = await pool.query(query);
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // Restock Report
    /**
     * Retrieves all items that need to be restocked
     * @author Cole McAnelly
     * @param {json} res - returns a json of all items over the restock threshold
     * @return {void}
     */
    app.get("/restock-report", async (req, res) => {
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
            console.error("Error fetching restock report:", error);
            res.status(500).send("Error fetching restock report");
        }
    });

    // Sales Report
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

    // X Report
    /**
     * Retrieves all the necessary items to compute an X report
     * @author Logan Kettle
     * @param req - unused, the queries are completely independent
     * @param res - the ending date and time of the previous z report as well as
     * the sales in dollars since the last z report closed
     * @return {void}
     */
    app.get("/x-report", async (req, res) => {
        try {
            // Query 1: get end_date
            const end_date_query =
                "SELECT order_date FROM orders WHERE order_id = (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
            const end_date_response = await pool.query(end_date_query);

            // Query 2: get end_time
            const end_time_query =
                "SELECT order_time FROM orders WHERE order_id = (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
            const end_time_response = await pool.query(end_time_query);

            // Query 3: get sales
            const sales_query =
                "SELECT SUM(order_total) FROM orders WHERE order_id > (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
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

    // Z Report
    /**
     * Retrieves all necessary items to compute a Z report and inserts the range of orders
     * covered since last z report, inserting an entry in to the z_reports table
     * @author Logan Kettle
     * @param req - unused, same as above
     * @param res- the start and end date and time of the report to be computed as well
     * as all the sales received during that period
     * @return {void}
     */
    app.get("/z-report", async (req, res) => {
        try {
            // Query 5: get sales
            const sales_query =
                "SELECT SUM(order_total) FROM orders WHERE order_id > (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
            const sales_response = await pool.query(sales_query);

            //
            await pool.query(
                "INSERT INTO z_reports(report_id, sales, start_order_id, end_order_id) VALUES ( (SELECT (MAX(report_id) + 1) FROM z_reports), (SELECT SUM(order_total) FROM orders WHERE order_id > (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))), (SELECT (end_order_id + 1) FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports)), (SELECT MAX(order_id) FROM orders) )"
            );

            // Query 1: get start_date
            const start_date_query =
                "SELECT order_date FROM orders WHERE order_id = (SELECT start_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
            const start_date_response = await pool.query(start_date_query);

            // Query 2: get start_time
            const start_time_query =
                "SELECT order_time FROM orders WHERE order_id = (SELECT start_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
            const start_time_response = await pool.query(start_time_query);

            // Query 3: get end_date
            const end_date_query =
                "SELECT order_date FROM orders WHERE order_id = (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
            const end_date_response = await pool.query(end_date_query);

            // Query 4: get end_time
            const end_time_query =
                "SELECT order_time FROM orders WHERE order_id = (SELECT end_order_id FROM z_reports WHERE report_id = (SELECT MAX(report_id) FROM z_reports))";
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


}