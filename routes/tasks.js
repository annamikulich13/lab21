const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tasksController");
const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// Публичные
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);

// Только для админа
router.post("/", authMiddleware, isAdmin, ctrl.create);
router.put("/:id", authMiddleware, isAdmin, ctrl.update);
router.patch("/:id", authMiddleware, isAdmin, ctrl.patch);
router.delete("/:id", authMiddleware, isAdmin, ctrl.remove);

module.exports = router;
