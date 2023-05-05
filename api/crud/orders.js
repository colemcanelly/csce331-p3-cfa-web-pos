/* CRUD Operations for Orders */
module.exports = (app, pool) => {
    /**
     * @overview This file contains utility functions for accessing menu.
     * Creates new Order
     * Loops through a list of ordered items and inserts them into the orders table in the database
     * @author Cole McAnelly
     * @param req - passes in all the attributes of the orders
     * @param res - confirmation that order was submitted
     * @return {void}
     */
    app.post("/order", async (req, res) => {
        console.log("HI");
        const {
            currentOrder,
            order_date,
            order_time,
            customer_fname,
            order_creator,
        } = req.body;
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

    /**
     * Reads the entire history of all recorded orders in the database
     * @author Cole McAnelly
     * @param {Array} res - a json with all orders and their attributes stored
     * @return {json}
     */
    app.get("/orders", async (req, res) => {
        try {
            const allTodos = await pool.query("SELECT * FROM orders");
            res.json(allTodos.rows);
        } catch (err) {
            console.error(err.message);
        }
    });
}