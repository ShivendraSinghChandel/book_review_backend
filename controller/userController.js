const userModel = require("../model/userModel");
const { compare_password, create_token, hash_password, verify_token } = require("../utils/hashing");


const register = async(req,res) =>{
    try{
    const data = req.body;
    const existing_email = await userModel.findOne({email:data.email})
    if(existing_email) {
        return res.status(409).json({
            success:false,
            message:"This email already exist"
        })
    }
    const existing_username = await userModel.findOne({username:data.username})
    if(existing_username) {
        return res.status(409).json({
            success:false,
            message:"This username already taken"
        })
    }
    
    const hashed_password = await hash_password(data.password);
    const result = await userModel.create({
        username:data.username,
        email:data.email,
        password:hashed_password
    })
    const token = create_token({id:result._id,role:result.role})
    res.status(200).json({
        success:true,
        message:"user registered successfully",
        token
    })

}
catch(err){
    res.status(500).json("error occured",err)
}
}

const login = async(req,res) =>{
    try{
    const data = req.body;
    // console.log(data)
    const user = await userModel.findOne({email:data.email})
    if(!user) {
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    // console.log(user)

    const pass = await compare_password(data.password, user.password)
    if(!pass) {
        return res.status(400).json({
            success:false,
            message:"invalid credentials"
        })
    }

    if(data.role !== user.role) {
        return res.status(400).json({
            success:false,
            message:"invalid request"
        })
    }
    const token = create_token({id:user._id, role:user.role})
    res.status(200).json({
        success:true,
        message:"logged in",
        token,
        role:user.role
    })
    }
    catch(err){
    res.status(500).json("error occured",err)
}

}

const verify = async(req,res) =>{
   try{
     const data = req.body;
     const decoded_data = verify_token(data.token);
    //  console.log(decoded_data)
     if(!decoded_data) {
        return res.status(401).json({
            success:false,
            message:"unauthenticated"
        })
     }
     const user = await userModel.findById(decoded_data.id)
     res.status(200).json({
        success:true,
        data:user
     })
   }
   catch(err){
     res.status(500).json("an error occured",err)
   }
}


module.exports ={
    register,
    login,
    verify
}