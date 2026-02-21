require('dotenv').config()
const app = require("./src/app")   // or correct path
const connectToDB = require("./src/config/database")

connectToDB()

app.listen(5001, () => {
  console.log("server started")
})