const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  Logout,
  Getuser,
  Getalluser,
  Countuser,
  GetUserById,
} = require("../services/authService.js");
const {
  AuthMiddleware,
  permisionUser,
} = require("../middleware/AuthMiddleware");

router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/users", AuthMiddleware, permisionUser("admin"), Getalluser);
router.get("/userid", AuthMiddleware, permisionUser("admin"), GetUserById);
router.get("/user", AuthMiddleware, Getuser);
router.get("/count", AuthMiddleware, permisionUser("admin"), Countuser);

module.exports = router;
