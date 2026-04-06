const { Router } = require("express");
const passport = require("passport");
const router = Router();
const authController = require("../controller/authController");

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

module.exports = router;