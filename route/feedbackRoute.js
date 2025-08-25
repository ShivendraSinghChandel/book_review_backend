const express = require("express")
const route = express.Router();
const { create, update, deletefeedback, get_user_feedback } = require("../controller/feedbackController");

route.post("/create",create)
route.put("/update",update)
route.post("/get_user_feedback",get_user_feedback)
route.delete("/delete/:id/:book_id",deletefeedback)

module.exports=route