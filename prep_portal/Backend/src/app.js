const express = require('express');
const videoRouter = require('../src/routes/video.routes')
const authRouter = require("../src/routes/auth.routes")
const cors = require("cors")
const progressRouter = require("../src/routes/progress.routes")

const cookieparser = require("cookie-parser")


const app = express()
app.use(express.json())
app.use(cookieparser())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use("/api/prep", authRouter)
app.use("/api/prep", videoRouter)
app.use("/api/prep/progress", progressRouter)

module.exports = app;