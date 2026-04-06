const { Router } = require("express");
const passport = require("passport");
const router = Router();
const authController = require("../controller/authController");

router.get("/", authController.home);

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

module.exports = router;