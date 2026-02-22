require('dotenv').config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})