const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/profile", authMiddleware, ctrl.profile);
router.delete("/users/:id", authMiddleware, isAdmin, ctrl.deleteUser);

module.exports = router;
