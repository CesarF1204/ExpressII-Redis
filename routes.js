const express = require("express");
const router = express.Router();
const UserController = require("./controllers/users");

router.get("/", UserController.index);
//register
router.post("/register_form", UserController.registerForm);
//login
router.post("/login_form", UserController.loginForm);
router.get("/students/profile", UserController.successLogin);
//logout
router.get("/logout", UserController.logout);

module.exports = router;