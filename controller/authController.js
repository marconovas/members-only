const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const { validationResult } = require("express-validator");

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
        messages: messages.rows,
        admin: req.user.role
    });
}

exports.getRegister = (req, res) => {
    res.render("register-form", { errors: [] });
}

exports.postRegister = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).render("register-form", { 
            errors: errors.array()
        });
    }

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

//DELETE MESSAGE
exports.delete = async(req, res, next) => {
    const msgId = req.params.id;

    try{
        const result = await pool.query(
            "DELETE FROM messages WHERE message_id = $1",
            [msgId]
        );

        if(result.rowCount === 0) {
            return res.status(404).send("Message not Found");
        }

        res.redirect("/dashboard");
    } catch(error) {
        console.log(error);
        return next(error);
    }
}

//ADMIN
exports.getClubForm = (req, res) => {
    res.render("club-form");
}

exports.postClubForm = async (req, res, next) => {
    const password = req.body.password;
    const userId = req.user.user_id;

    if(password === process.env.ADMIN_PASSWORD){
        try{
            await pool.query(
                "UPDATE users SET role = true WHERE user_id = $1",
                [userId]
            )

            return res.redirect("/dashboard");
        } catch(error) {
            console.log(error);
            return next(error);
        }
    } 
}
