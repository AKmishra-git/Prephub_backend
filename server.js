require('dotenv').config()
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)
const app = require("./src/app")
const connectToDB = require("./src/config/database")


connectToDB()

const PORT = process.env.PORT || 5001;

app.listen(PORT, ()=>{
  console.log("server started")
})