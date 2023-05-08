const express = require("express");
const cookieParser = require("cookie-parser"); // Login/Logout Dep's
const sessions = require("express-session");

const app = express();
const oneDay = 1000 * 60 * 60 * 24;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Cookie Parser Middleware
app.use(
    sessions({
        // Session Middleware
        secret: "thisismysecretkeycoleryanwestonloganckfla5223",
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false,
    })
);

module.exports = app;