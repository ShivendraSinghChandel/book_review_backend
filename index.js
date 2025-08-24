const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const env = require("dotenv")
env.config();
const app = express()
const morgan = require("morgan")
app.use(morgan("tiny"))

mongoose.connect(`${process.env.DATABASE_URL}`)
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE"]
}));
app.use(express.json())
const userRoute = require("./route/userRoute")
const bookRoute = require("./route/bookRoute")
const feedbackRoute = require("./route/feedbackRoute")

app.use("/user",userRoute)
app.use("/book",bookRoute)
app.use("/feedback",feedbackRoute)


app.listen(process.env.PORT,()=>{
    console.log("Server running")
})