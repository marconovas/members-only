const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

exports.home = (req, res) => {
    res.render("index");
} 

exports.getRegister = (req, res) => {
    res.render("register-form");
}

exports.postRegister = async (req, res, next) => {
    try{
        const hashed = await bcrypt.hash(req.body.password, 10);
    
        await pool.query(
            "INSERT INTO users (first_name, last_name, username, password, email, role) VALUES ($1, $2, $3, $4, $5, $6)",
            [req.body.firstname, req.body.lastname, req.body.username, hashed, req.body.email, false]
        );
    
        return res.redirect("/"); //CHANGE REDIRECT
    } catch (error) {
        console.error(error);
        next(error);
    }
}