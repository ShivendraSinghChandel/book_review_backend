const express = require("express")
const route = express.Router();
const { register, login, verify } = require("../controller/userController");

route.post("/register",register)
route.post("/login",login)
route.post("/verify",verify)

module.exports= route;