const app = require("./app");
const pool = require("./db");

// A variable to save a session
var session;

require("./users")(app, pool, session); // User login/logout & register
require("./reports")(app, pool);        // Routing for Reports
require("./crud/menu")(app, pool);      // Menu:    Create, Read, Update, & Delete
require("./crud/supply")(app, pool);    // Supply:  Create, Read, Update, & Delete
require("./crud/recipes")(app, pool);   // Recipes: Create, Read, Update, & Delete
require("./crud/orders")(app, pool);    // Orders:  Create & Read

export default {
    path: "/api",
    handler: app,
};