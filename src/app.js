const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const videoRouter = require('./routes/video.routes')
const authRouter = require('./routes/auth.routes')
const progressRouter = require('./routes/progress.routes')
const app = express();

// middlewares
app.use(cors({
  origin: "https://prephub-frontend.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/prep", authRouter);
app.use("/api/prep", videoRouter);
app.use("/api/prep/progress", progressRouter);

module.exports = app;