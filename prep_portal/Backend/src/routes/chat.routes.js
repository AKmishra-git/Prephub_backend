const express = require("express")
const router = express.Router()
const ctrl = require("../controller/chat.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.post("/", authMiddleware, ctrl.sendMessage)

module.exports = router