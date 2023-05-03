const Pool = require("pg").Pool;

/**
 * This function adds two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} - The sum of the two numbers.
 */
const pool = new Pool({
    user: "csce315331_delta_master",
    password: "airplane",
    database: "csce315331_delta",
    host: "csce-315-db.engr.tamu.edu",
    port: 5432
})

module.exports = pool;