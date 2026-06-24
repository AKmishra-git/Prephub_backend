const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const noteRouter = require('./routes/note.routes')
const videoRouter = require('./routes/video.routes')
const authRouter = require('./routes/auth.routes')
const progressRouter = require('./routes/progress.routes')

const app = express();

const passport = require("./config/passport")
app.use(passport.initialize())

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://prep-portal-frontend.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/prep", authRouter);
app.use("/api/prep", videoRouter);
app.use("/api/prep/progress", progressRouter);
app.use("/api/notes", noteRouter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;