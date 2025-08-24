const mongoose=require("mongoose");

const feedbackSchema=new mongoose.Schema({
    book_id:{type: mongoose.Schema.Types.ObjectId,ref:'book'},
    user_id:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
    rating:{type:Number},
    comment:{type:String}
})

module.exports=mongoose.model("feedback",feedbackSchema);