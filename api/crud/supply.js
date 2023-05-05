/**
 * This is a description of what file1.js does.
 *
 * @overview This file provides functionality for handling user authentication.
 */
/* CRUD Operations for Supply */
module.exports = (app, pool) => {

    /**
     * Creates new menu or inventory item into their respective tables
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
        } catch (err) {
            console.error("Error posting new supply item:", err);
            res.status(500).send("Error posting new supply item");
        }
    });


    // READ
    app.get("/supply", async (req, res) => {
        try {
            const allTodos = await pool.query("SELECT * FROM supply");
            res.json(allTodos.rows);
        } catch (err) {
            console.error(err.message);
        }
    });
    app.post("/supplyIngredient", async (req, res) => {
        try {
            const allTodos = await pool.query("SELECT ingredient FROM supply");
            res.json(allTodos.rows);
        } catch (err) {
            console.error(err.message);
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
            res.json("Supply was updated!");
        } catch (err) {
            console.error("Error updating supply item:", err.message);
            res.status(500).send("Error updating supply item");
        }
    });


    /**
     * Deletes a particular ingredient from the database
     * @author Ryan Paul
     * @param req - specifications for ingredient to remove
     * @param res - confirmation that ingredient was removed
     * @return {void}
     */
    app.delete("/supply", async (req, res) => {
        try {
            const { ingredient, threshold, restock_quantity } = req.body;
            const delete_ingredient = await pool.query(
                `DELETE FROM supply WHERE ingredient = '${ingredient}';`
            );
            // console.log(`Deleting ${ingredient}`);
            res.json(`Supply item successfully deleted`);
        } catch (err) {
            console.error("Error deleting supply item:", err);
            res.status(500).send("Error deleting supply item");
        }
    });

}