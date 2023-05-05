/* CRUD Operations for Repices */
module.exports = (app, pool) => {

    // CREATE
    app.post("/recipes", async (req, res) => {
        try {
            console.log("here");
            const { menu_item, ingredient, portion_count } = req.body;
            const q = `INSERT INTO recipes (menu_item, ingredient, portion_count)
          VALUES ('${menu_item}', '${ingredient}', ${portion_count});`;
            console.log("This: ", q);
            const newItem = await pool.query(q);
            res.json(newItem.rows[0]);
        } catch (err) {
            console.error("Error posting new menu item:", err);
            res.status(500).send("Error posting new menu item");
        }
    });

    // READ
    app.get("/recipes", async (req, res) => {
        try {
            const allTodos = await pool.query("SELECT * FROM recipes");
            res.json(allTodos.rows);
        } catch (err) {
            console.error(err.message);
        }
    });
    app.post("/ingredients", async (req, res) => {
        try {
            const allTodos = await pool.query(
                "SELECT ingredient,portion_count FROM recipes"
            );
            res.json(allTodos.rows);
        } catch (err) {
            console.error(err.message);
        }
    });
    app.post("/itemIngredients", async (req, res) => {
        try {
            const { menu_item } = req.body;
            const allTodos = await pool.query(
                "SELECT ingredient,portion_count FROM recipes WHERE menu_item = '" +
                menu_item + "';"
            );
            res.json(allTodos.rows);
        } catch (err) {
            console.error(err.message);
        }
    });


    //updates an menu item's recipe
    /**
     * @overview This file contains utility functions for accessing menu.
     * Update a menu item's recipe
     * @author Ryan Paul
     * @param req - takes in the menu item to be updated, the ingredient to be added,
     * and what portion it will take part in that item
     * @param res - confirmation that the menu item was updated
     * @return {void}
     */
    app.put("/recipes", async (req, res) => {
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

    // DELETE
    app.delete("/recipes", async (req, res) => {
        try {
            console.log("reached delete");
            const { menu_item, ingredient } = req.body;
            const delete_recipe_item = await pool.query(
                `
            DELETE FROM recipes 
            WHERE menu_item = $1 AND ingredient = $2;`,
                [menu_item, ingredient]
            );
            res.json(`Menu item successfully deleted`);
        } catch (err) {
            console.error("Error deleting menu item:", err);
            res.status(500).send("Error deleting menu item");
        }
    });

}