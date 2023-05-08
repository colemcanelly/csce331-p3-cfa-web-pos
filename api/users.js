/**
 * @overview This file contains utility functions for OAuth and our user psql table.
 * @author Cole McAnelly
 * @param {import('express').Application} app - Express app instance
 * @param {import('pg').Pool} pool - Postgres connection pool instance
 * @param {import('express-session').Session} session - Express session instance
 */
module.exports = (app, pool, session) => {
    // LOGIN

    /**
     * Handles login request and checks the database for user data before sending that data as a response to the client
     * @param {import('express').Request} req - Express request instance
     * @param {import('express').Response} res - Express response instance
     * @return {void}
     */
    app.post("/login", async (req, res) => {
        try {
            const { username, password } = req.body;

            // Query the username and password
            const q = `
          SELECT user_id, permissions, fname, lname FROM users
          WHERE user_email = '${username}' AND user_pw = '${password}';`;
            const result = await pool.query(q);

            // Get result
            const user = result.rows.at(0);

            // Create a session
            session = req.session;

            // SERVER SIDE: Store userID and permission level
            session.userid = user.user_id;
            session.permissions = user.permissions;

            // CLIENT SIDE: Store first and last name
            res.cookie('fname', user.fname);
            res.cookie('lname', user.lname);
            res.cookie('permissions', user.permissions);

            // Send the URL to redirect the user to
            let url = (session.permissions == 0) ? '/customer/categories' : (session.permissions == 1) ? '/server' : '/managerMenu';
            res.send(url);
        }
        catch (err) {
            console.error(err.message);
            res.status(401).send('Invalid username or password');
        }
    });

    /**
     * Handles Google login callback
     * @param {import('express').Request} req - Express request instance
     * @param {import('express').Response} res - Express response instance
     * @return {void}
     */
    // app.get('/googlelogin', (req, res) => {
    //     try {
    //         res.send(`Running /googlelogin. what is: ${req.params}`);
    //         // req.session.user = { user: req.user };
    //     } catch (err) {
    //         console.error(err.message);
    //         res.status(401).send('Google login failed');
    //     }
    // });

    /**
     * Handles logout request
     * @param {import('express').Request} req - Express request instance
     * @param {import('express').Response} res - Express response instance
     * @return {void}
     */
    app.post('/logout', (req, res) => {
        req.session.destroy();
        res.clearCookie('fname');
        res.clearCookie('lname');
        res.clearCookie('permissions');

        res.end();
        // res.redirect('/login');
    });

    // Register

    /**
     * Handles register request and creates a new entry in the user database with all the provided user data
     * @param {import('express').Request} req - Express request instance
     * @param {import('express').Response} res - Express response instance
     * @return {void}
     */
    app.post("/register", async (req, res) => {
        try {
            const { auth } = req.body;
            const permissions = 0;

            // Post to server
            const q = `
          INSERT INTO users (permissions, user_email, user_pw, fname, lname)
          SELECT ${permissions},'${auth.email}','${auth.password}','${auth.fname}','${auth.lname}'
          WHERE
              NOT EXISTS (
                  SELECT user_id FROM users WHERE user_email = '${auth.email}'
              )
          RETURNING user_id;`;
            const result = await pool.query(q);

            // Get result
            const user_id = result.rows.at(0).user_id;

            // Create a session
            session = req.session;

            // SERVER SIDE: Store userID and permission level
            session.userid = user_id;
            session.permissions = permissions;

            // CLIENT SIDE: Store first and last name
            res.cookie('fname', auth.fname);
            res.cookie('lname', auth.lname);
            res.cookie('permissions', permissions);


            // Send the URL to redirect the user to
            let url = '/customer/categories';
            res.send(url);
        }
        catch (err) {
            console.error(err.message);
            res.status(401).send('Account already exists');
        }
    });

}