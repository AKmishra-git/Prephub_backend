const express = require("express")
const router = express.Router()
const ctrl = require("../controller/note.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.get("/:videoId", authMiddleware, ctrl.getNote)
router.post("/:videoId", authMiddleware, ctrl.saveNote)

module.exports = router