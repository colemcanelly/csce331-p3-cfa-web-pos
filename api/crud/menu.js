/* CRUD Operations for Menu */
module.exports = (app, pool) => {

    // Creating new menu/inventory items
    /**
     * Creates new menu item by adding to database
     * @author Weston Cadena
     * @paramreq - passes in specfications of the new menu item
     * @param {json} res - returns json of the item that was inserted into the database
     * @return {void}
     */
    app.post("/menu", async (req, res) => {
        try {
            const { menu_item, food_price, combo, menu_cat } = req.body;
            const q = `
                INSERT INTO menu (menu_item, menu_cat, combo, food_price)
                VALUES ('${menu_item}', '${menu_cat}', '${combo}', ${food_price});`;
            const newItem = await pool.query(q);
            res.json(newItem.rows[0]);
        } catch (err) {
            console.error("Error posting new menu item:", err);
            res.status(500).send("Error posting new menu item");
        }
    });

    // READ
    app.get("/menu", async (req, res) => {
        try {
            const allTodos = await pool.query("SELECT * FROM menu");
            res.json(allTodos.rows);
        } catch (err) {
            console.error(err.message);
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
            // console.log(q);
            const updateMenu = await pool.query(q);

            res.json("Menu was updated!");
        } catch (err) {
            console.error("Error updating menu item:", err.message);
            res.status(500).send("Error updating menu item");
        }
    });

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
            const delete_menu_item = await pool.query(
                `DELETE FROM menu WHERE menu_item = '${menu_item}';`
            );
            res.json(`Menu item successfully deleted`);
        } catch (err) {
            console.error("Error deleting menu item:", err);
            res.status(500).send("Error deleting menu item");
        }
    });

}