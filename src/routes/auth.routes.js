const express = require('express');
const authController = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const { getMe } = require("../controller/auth.controller")

const authRouter = express.Router()


authRouter.post("/register",authController.userRegister)
authRouter.post("/login", authController.userLogin);



authRouter.get("/me", authMiddleware, authController.getMe)
authRouter.post("/logout", authController.logout)


module.exports = authRouter
