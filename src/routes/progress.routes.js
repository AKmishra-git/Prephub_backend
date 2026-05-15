const express = require("express")
const router = express.Router()
const ctrl = require("../controller/progress.controller")
const authMiddleware = require("../middleware/auth.middleware")

// mark watched
router.post("/", authMiddleware, ctrl.markWatched)

// get progress
router.get("/:subject", authMiddleware, ctrl.getProgress)

router.get("/dashboard", authMiddleware, ctrl.getDashboardStats)

module.exports = router