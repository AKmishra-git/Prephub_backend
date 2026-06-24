const express = require('express');
const authController = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const { getMe } = require("../controller/auth.controller")
const passport = require("../config/passport")
const jwt = require("jsonwebtoken")

const authRouter = express.Router()

authRouter.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

// Step 2 — Google redirects back here
authRouter.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=true`
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      process.env.JWT_SECRET
    )

    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })

    res.redirect(`${process.env.FRONTEND_URL}`)
  }
)


authRouter.post("/register",authController.userRegister)
authRouter.post("/login", authController.userLogin);



authRouter.get("/me", authMiddleware, authController.getMe)
authRouter.post("/logout", authController.logout)


module.exports = authRouter
