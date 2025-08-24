const mongoose=require("mongoose");

const bookSchema=new mongoose.Schema({
    title:{type:String},
    author:{type:String},
    genre:{type:String},
    published_year:{type:Date},
    available_copies:{type:Number},
    average_rating:{type:Number},
})

module.exports=mongoose.model("book",bookSchema);