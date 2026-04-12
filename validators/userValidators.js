const { body } = require("express-validator");
const pool = require("../db/pool");

exports.registerValidator = [
    body("username")
    .trim()
    .notEmpty()
    .withMessage("Username must not be empty")
    .isAlpha()
    .withMessage("Username must be alphanumeric"),

    body("email")
    .isEmail().withMessage("Invalid E-mail")
    .custom(async (email) => {
        const result = await pool.query(
            "SELECT 1 FROM users WHERE email = $1",
            [email]
        )

        if(result.rows.length > 0){
            throw new Error("E-mail already in use");
        }
    }),

    body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters!")
]