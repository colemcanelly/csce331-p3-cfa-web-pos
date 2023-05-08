/**
 * @overview This file joins all other js files so out vue components only need one include
 * @author Cole McAnelly
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} - The sum of the two numbers.
 */

const app = require("./app");
const pool = require("./db");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// A variable to save a session
var session;
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/error', (req, res) => res.send("Error logging in"));

passport.serializeUser((user, callback) => callback(null, user));
passport.deserializeUser((obj, callback) => callback(null, obj));


passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://cfapos.fly.dev/api/googlelogin/callback"
    },
    (accessToken, refreshToken, profile, callback) => {
        userProfile = profile;
        return callback(null, userProfile);
    })
);


app.get('/googlelogin', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/googlelogin/callback', passport.authenticate('google', { failureRedirect: '/error' }), async (req, res) => {
    console.log("running /googlelogin/callback");
    try {
        let google = {
            email: userProfile.emails[0].value,
            fname: userProfile.name.givenName,
            lname: userProfile.name.familyName,
            permissions: 0,
            userId: null
        };
        const sel_q = `
        SELECT user_id FROM users
        WHERE user_email = '${google.email}' AND is_oauth = 'false';`;
        let sel_result = await pool.query(sel_q);
        if (sel_result.rowCount == 0) {
            const ins_q = `
            INSERT INTO users (permissions, user_email, fname, lname, is_oauth)
            SELECT ${google.permissions},'${google.email}','${google.fname}','${google.lname}', false
            WHERE NOT EXISTS ( SELECT user_id FROM users WHERE user_email = '${google.email}' ) RETURNING user_id;`;
            let ins_result = await pool.query(ins_q);
            const user = ins_result.rows.at(0);
            google.userId = user.userId;
        } else {
            const user = sel_result.rows.at(0);
            google.userId = user.userId;
        }
        // Create a session
        session = req.session;

        // SERVER SIDE: Store userID and permission level
        session.firstName = google.fname;
        session.lastName = google.lname;
        session.userid = google.userId;
        session.permissions = google.permissions;

        // CLIENT SIDE: Store first and last name
        res.cookie('fname', google.fname);
        res.cookie('lname', google.lname);
        res.cookie('permissions', google.permissions);
        res.redirect('/customer/categories');
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");

    }
});

app.get('/googlelogin/user', (req, res) => res.send(userProfile));

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