const Pool = require("pg").Pool;

const pool = new Pool({
    user: "csce315331_delta_master",
    password: "airplane",
    database: "csce315331_delta",
    host: "csce-315-db.engr.tamu.edu",
    port: 5432
})

module.exports = pool;