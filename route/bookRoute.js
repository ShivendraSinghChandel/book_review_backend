const express = require("express")
const route = express.Router();
const { create, update, get_all_books, get_single_book, deletebook } = require("../controller/bookController");

route.post("/create",create)
route.put("/update",update)
route.get("/getall",get_all_books)
route.get("/getsingle/:id",get_single_book)
route.delete("/deletebook/:id",deletebook)

module.exports=route