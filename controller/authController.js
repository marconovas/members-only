const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

exports.home = (req, res) => {
    res.render("index");
} 

exports.getDashBoard = async (req, res) => {
    //TRAER TODOS LOS MENSAJES DE TODOS LOS USUARIOS (NO PRIVADO)
    const messages = await pool.query(`
        SELECT messages.*, users.username
        FROM messages
        JOIN users ON messages.user_id = users.user_id
        ORDER BY created_at DESC
    `);

    res.render("dashboard",  { 
        user: req.user, 
        messages: messages.rows
    });
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
    
        return res.redirect("/login");
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getLogIn = (req, res) => {
    res.render("login-form");
}

exports.logout = (req, res, next) => {
    req.logout( error => {
        if(error) return next(error);
        res.redirect("/");
    });
};

//MESSAGES
exports.getMessageForm = (req, res) => {
    res.render("messages");
}

exports.postMessage = async (req, res, next) => {
    try{
        if(!req.user) {
            return res.redirect("/login");
        }

        await pool.query(
            "INSERT INTO messages(content, user_id) VALUES ($1, $2)",
            [req.body.text, req.user.user_id]
        );

        return res.redirect("/dashboard");
    } catch(error) {
        console.log(error);
        return next(error);
    }
}