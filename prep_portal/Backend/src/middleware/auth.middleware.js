const jwt = require("jsonwebtoken")
const Blacklist = require("../models/blacklist.model")
const redis = require("../config/cache.js")

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.jwt_token

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - no token",
      })
    }

    // ✅ check if token is blacklisted
    const isBlacklisted = await redis.get(token);
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized - token has been invalidated. Please login again.",
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