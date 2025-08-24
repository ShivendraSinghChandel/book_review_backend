const mongoose = require("mongoose")
const userModel = require("./model/userModel")
const { hash_password } = require("./utils/hashing")
require("dotenv").config()

mongoose.connect(process.env.DATABASE_URL)

const createAdmin = async (email, password) => {
    try{
        const hashed = await hash_password(password)
        const admin = await userModel.create({
            username: "admin",
            email: email,
            password: hashed,
            role: "admin"
        })
        console.log("Admin created:", admin)
        process.exit()
    }catch(err){
        console.log(err)
        process.exit()
    }
}

createAdmin("admin@example.com","12345")
