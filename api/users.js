module.exports = (app, pool, session) => {
    // LOGIN
    // Get USER
    app.post("/login", async (req, res) => {
        try {
            const { auth } = req.body;
            // Query the username and password
            const q = `
            SELECT user_id, permissions, fname, lname FROM users
            WHERE user_email = '${auth.username}' AND user_pw = '${auth.password}';`;
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

            // Send the URL to redirect the user to
            let url = (session.permissions == 0) ? '/customer/categories' : (session.permissions == 1) ? '/server' : '/managerMenu';
            res.send(url);
        }
        catch (err) {
            console.error(err.message);
            res.status(401).send('Invalid username or password');
        }
    });

    app.get('/auth/googlelogin', (req, res) => {
        console.log("Running /auth/googlelogin");
        req.session.user = { user: req.user };
    });

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

    // Register
    // POST user
    app.post("/register", async (req, res) => {
        try {
            const { auth } = req.body;
            const permissions = 0
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