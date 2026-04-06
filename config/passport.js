const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

passport.use(new LocalStrategy (async (username, password, done) => {
    try{
        const { rows } = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        const user = rows[0];

        if(!user){
            return done(null, false);
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match) return done(null, false);

        console.log("USER EN LOGIN:", user);
        
        return done(null, user);
    } catch(error) {
        return done(error);
    }
})
);

passport.serializeUser((user, done) => {
    console.log("SERIALIZE:", user);
    done(null, user.user_id);
})

passport.deserializeUser(async (id, done) => {
    try{
        const { rows } = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [id]
        );
        done(null, rows[0]);
    } catch(error) {
        done(error);
    }
})

module.exports = passport;