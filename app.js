require("dotenv").config();
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");
const passport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public"))); //styles
app.use(express.urlencoded({ extended: false }));

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
        pruneSessionInterval: 60
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, (error) => {
    if(error) {
        throw error;
    }
    console.log(`Listening to port ${PORT}...`)
});