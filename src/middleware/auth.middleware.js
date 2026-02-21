const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.jwt_token

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - no token",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized - invalid token",
    })
  }
}

module.exports = authMiddleware
