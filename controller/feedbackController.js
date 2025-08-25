const bookModel = require("../model/bookModel");
const feedbackModel = require("../model/feedbackModel");
const { verify_token } = require("../utils/hashing");

const create = async(req,res) =>{
   try{
     const data = req.body;
    const decoded_data = verify_token(data.token);
    if(!decoded_data) {
        return res.status(400).json({
            success:false,
            message:"invalid token"
        })
    }
    const user_id = decoded_data.id;
    const feedback = await feedbackModel.create({
        user_id:user_id,
        book_id:data.book_id,
        rating:data.rating,
        comment:data.comment
    })
    if(!feedback) {
        return res.status(400).json({
            success:false,
            message:"feedback not saved"
        })
    }

    const allFeedbacks = await feedbackModel.find({ book_id: data.book_id });
     let avgRating = 0;
     if(allFeedbacks.length > 0) {
     const totalRatings = allFeedbacks.reduce((sum, f) => sum + f.rating, 0);
     avgRating = totalRatings / allFeedbacks.length;
     }

     await bookModel.findByIdAndUpdate(data.book_id, { average_rating: avgRating });

    res.status(200).json({
        success:true,
        message:"feedback saved"
    })
   }
   catch(err) {
    res.status(500).json("an error occured",err)
   }

}


const update = async(req,res) =>{
   try{
     const data = req.body;
     const feedback = await feedbackModel.findByIdAndUpdate(
        data.id,
        { rating:data.rating, comment:data.comment },
        { new:true }
     )
     if(!feedback) {
        return res.status(400).json({
            success:false,
            message:"feedback not updated"
        })
     }
     const allFeedbacks = await feedbackModel.find({ book_id: data.book_id });
     let avgRating = 0;
     if(allFeedbacks.length > 0) {
     const totalRatings = allFeedbacks.reduce((sum, f) => sum + f.rating, 0);
     avgRating = totalRatings / allFeedbacks.length;
     }

     await bookModel.findByIdAndUpdate(data.book_id, { average_rating: avgRating });
     res.status(200).json({
        success:true,
        message:"feedback updated"
     })
   }
   catch(err) {
    res.status(500).json("an error occured",err)
   }
}

const deletefeedback = async(req,res) => {
   try{
     const { id, book_id } = req.params;
     
     const feedback = await feedbackModel.findByIdAndDelete(id);
     if(!feedback) {
        return res.status(400).json({
            success: false,
            message: "feedback not deleted"
        })
     }
     
     const allFeedbacks = await feedbackModel.find({ book_id: book_id });
     
     let avgRating = 0;
     if(allFeedbacks.length > 0) {
         const totalRatings = allFeedbacks.reduce((sum, f) => sum + f.rating, 0);
         avgRating = totalRatings / allFeedbacks.length;
     }

     await bookModel.findByIdAndUpdate(book_id, { average_rating: avgRating });
     
     res.status(200).json({
        success: true,
        message: "feedback deleted"
     })
   }
   catch(err) {
    res.status(500).json({
        success: false,
        message: "an error occurred",
        error: err.message
    })
   }
}

const get_user_feedback = async(req,res) =>{
   try{
     const data = req.body;
     const decoded_data = verify_token(data.token);
     if(!decoded_data) 
        {
        return res.status(400).json({
            success:false,
            message:"invalid token"
        })
     }
     const user_id = decoded_data.id;
     const feedbacks = await feedbackModel.find({
        user_id:user_id,
        book_id:data.book_id
     })
     res.status(200).json({
        success:true,
        data:feedbacks
     })
   }
   catch(err) {
    res.status(500).json("an error occured",err)
   }
}


module.exports = {
    create,
    update,
    deletefeedback,
    get_user_feedback
}