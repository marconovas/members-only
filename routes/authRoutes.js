const { Router } = require("express");
const passport = require("passport");
const router = Router();
const authController = require("../controller/authController");

function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

router.get("/", authController.home);

router.get("/dashboard", authController.getDashBoard);

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get("/login", authController.getLogIn);
router.post("/login", 
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/"
    })
);

router.get("/logout", authController.logout);

//MESSAGES
router.get("/message", authController.getMessageForm);
router.post("/message", isAuth, authController.postMessage);

module.exports = router;