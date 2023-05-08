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
        const { ingredient, threshold, restock_quantity, current_quantity } = req.body;
    
        // Insert new row in supply table
        const insertSupplyQuery = `
          INSERT INTO supply (ingredient, threshold, restock_quantity)
          VALUES ('${ingredient}', ${threshold}, ${restock_quantity})
          RETURNING *
        `;
        const newSupplyItem = await pool.query(insertSupplyQuery);
    
        // Insert new row in daily_inventory table
        const insertInventoryQuery = `
          INSERT INTO daily_inventory (ingredient, entry_date, qty_sod, qty_eod)
          VALUES ('${ingredient}', NOW(), ${current_quantity}, ${current_quantity})
          RETURNING *
        `;
        const newInventoryItem = await pool.query(insertInventoryQuery);
    
        res.json({
          supply: newSupplyItem.rows[0],
          inventory: newInventoryItem.rows[0]
        });
      } catch (err) {
        console.error("Error posting new supply item:", err);
        res.status(500).send("Error posting new supply item");
      }
    });


    // READ
    app.get("/supply", async (req, res) => {
        try {
            const q = `
            SELECT 
            s.*, 
            di.qty_eod AS current_quantity
          FROM 
            supply s
          JOIN 
            (
              SELECT 
                ingredient, 
                MAX(entry_date) AS max_date 
              FROM 
                daily_inventory 
              GROUP BY 
                ingredient
            ) latest_di
          ON 
            s.ingredient = latest_di.ingredient
          JOIN 
            daily_inventory di
          ON 
            latest_di.ingredient = di.ingredient 
            AND latest_di.max_date = di.entry_date;`;
            const allTodos = await pool.query(q);
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
    // app.put("/supply", async (req, res) => {
    //     try {
    //         const { ingredient, threshold, restock_quantity } = req.body;
    //         const q = `
    //             UPDATE supply
    //             SET threshold = '${threshold}', restock_quantity = ${restock_quantity}
    //             WHERE ingredient = '${ingredient}'`;
    //         console.log(q);
    //         const updateSupply = await pool.query(q);
    //         res.json("Supply was updated!");
    //     } catch (err) {
    //         console.error("Error updating supply item:", err.message);
    //         res.status(500).send("Error updating supply item");
    //     }
    // });
    app.put("/supply", async (req, res) => {
        try {
          const { ingredient, threshold, restock_quantity, current_quantity } = req.body;
      
          // update the supply table
          const updateSupplyQuery = `
            UPDATE 
              supply 
            SET 
              restock_quantity = ${restock_quantity}, 
              threshold = '${threshold}'
            WHERE 
              ingredient = '${ingredient}';
          `;
          await pool.query(updateSupplyQuery);
      
          // update the daily_inventory table with the current_quantity
          const updateInventoryQuery = `
            UPDATE daily_inventory
            SET qty_eod = ${current_quantity}
            WHERE ingredient = '${ingredient}'
            AND entry_date = (
                SELECT MAX(entry_date)
                FROM daily_inventory
                WHERE ingredient = '${ingredient}'
            )
          `;
          const response = await pool.query(updateInventoryQuery);
            console.log(response)
          res.json(response);
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
                `
                DELETE FROM daily_inventory 
                WHERE ingredient = '${ingredient}';

                DELETE FROM recipes 
                WHERE ingredient = '${ingredient}';

                DELETE FROM supply 
                WHERE ingredient = '${ingredient}';
                `
            );
            // console.log(`Deleting ${ingredient}`);
            res.json(`Supply item successfully deleted`);
        } catch (err) {
            console.error("Error deleting supply item:", err);
            res.status(500).send("Error deleting supply item");
        }
    });

}