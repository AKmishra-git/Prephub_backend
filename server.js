require('dotenv').config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

app.listen(5001, ()=>{
    console.log("server started");
    
})