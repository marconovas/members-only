const { Router } = require("express");
const passport = require("passport");
const router = Router();
const authController = require("../controller/authController");

function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

function isAdmin (req, res, next) {
    if(req.user && req.user.role === true) return next();
    return res.redirect("/login");
}

router.get("/", authController.home);

router.get("/dashboard", isAuth, authController.getDashBoard);

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
router.get("/messages/new", authController.getMessageForm);
router.post("/messages/new", isAuth, authController.postMessage);

//admin
router.get("/club", authController.getClubForm);
router.post("/club", authController.postClubForm);

//DELETE MESSAGES
router.post("/messages/:id/delete", authController.delete);


module.exports = router;