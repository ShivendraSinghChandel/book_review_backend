const bookModel = require("../model/bookModel");
const feedbackModel = require("../model/feedbackModel");

const create = async(req, res) =>{
    try{
        const data = req.body;
        if(!data) {
            return res.status(400).json({
            success:false,
            message:"data required"
        })
        }

        const book = await bookModel.create({
            title:data.title,
            author:data.author,
            genre:data.genre,
            published_year:data.published_year,           
            available_copies:data.available_copies,
            average_rating:data.average_rating
        })
        if(!book) {
             return res.status(400).json({
            success:false,
            message:"book not saved"
        })
        }
        res.status(200).json({
            success:true,
            message:"book saved"
        })
    }
    catch(err){
    res.status(500).json("error occured",err)
}
}

const update = async(req,res)=>{
    try{
        const { id, ...data } = req.body
        if(!id || !data)
            {
        return res.status(400).json({
                success:false,
                message:"id and data required"
            })
        }
        const book = await bookModel.findByIdAndUpdate(id,data,{new:true})
        if(!book)
            {
            return res.status(400).json({
                success:false,
                message:"book not updated"
            })
        }
        res.status(200).json({
            success:true,
            message:"book updated"
        })
    }
    catch(err){
        res.status(500).json("error occured",err)
    }
}

const get_single_book = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({
         success: false, 
         message: "Book id required" 
        });

    const book = await bookModel.findById(id);
    if (!book) return res.status(404).json({ 
        success: false, 
        message: "Book not found" 
    });

    const feedbacks = await feedbackModel.find({ book_id: id }).populate("user_id", "username email");

    res.status(200).json({ success: true, data: { book, feedbacks } });

  } catch (err) {
    res.status(500).json("error occured")
  }
};

const get_all_books = async (req, res) => {
  try {
    const { limit = 10, skip = 0, search = "" } = req.query;
    let query = {};

    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      query = { $or: [{ title: regex }, { author: regex }, { genre: regex }] };
    }

    const totalCount = await bookModel.countDocuments(query);

    const books = await bookModel.find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.status(200).json({ success: true, data: books, total: totalCount });
  } catch (err) {
    res.status(500).json({ success: false, message: "error occured", error: err.message });
  }
};




const deletebook = async(req,res)=>{
    try{
        const { id } = req.params
        if(!id){
            return res.status(400).json({
                success:false,
                message:"id required"
            })
        }
        const book = await bookModel.findByIdAndDelete(id)
        if(!book){
            return res.status(400).json({
                success:false,
                message:"book not deleted"
            })
        }
        await feedbackModel.deleteMany({ book_id: id })
        res.status(200).json({
            success:true,
            message:"book deleted"
        })
    }
    catch(err){
        res.status(500).json("error occured",err)
    }
}

module.exports = { 
    create, 
    update, 
    get_single_book,
    get_all_books, 
    deletebook
 }