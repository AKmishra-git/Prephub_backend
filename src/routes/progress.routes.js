const express = require("express")
const router = express.Router()
const ctrl = require("../controller/progress.controller")
const authMiddleware = require("../middleware/auth.middleware")

// mark watched
router.post("/", authMiddleware, ctrl.markWatched)

// ✅ dashboard must be BEFORE /:subject
router.get("/dashboard", authMiddleware, ctrl.getDashboardStats)

// get progress
router.get("/:subject", authMiddleware, ctrl.getProgress)

module.exports = router