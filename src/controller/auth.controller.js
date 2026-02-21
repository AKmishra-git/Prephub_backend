const userModel = require("../models/auth.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

// ===================== REGISTER =====================
async function userRegister(req, res) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const emailAlreadyExists = await userModel.findOne({
      email: normalizedEmail,
    })

    if (emailAlreadyExists) {
      return res.status(409).json({
        message: "User already exists",
      })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
      name,
      email: normalizedEmail,
      password: hash,
    })

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 🔥 Set cookie for production
    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })

    res.status(201).json({
      success: true,
      message: "You registered successfully",
      userId: user._id,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// ===================== LOGIN =====================
async function userLogin(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await userModel.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 🔥 Set cookie for production
    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })

    res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user._id,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// ===================== GET CURRENT USER =====================
async function getMe(req, res) {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      })
    }

    res.json({
      success: true,
      user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
}

// ===================== LOGOUT =====================
async function logout(req, res) {
  res.clearCookie("jwt_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  })

  res.json({
    success: true,
    message: "Logged out successfully",
  })
}

// ===================== EXPORTS =====================
module.exports = {
  userRegister,
  userLogin,
  getMe,
  logout,
}