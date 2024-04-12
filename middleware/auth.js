const jwt=require("jsonwebtoken")
const User = require("../models/userModel");

//User authentication check 
exports.isAuthenticatedUser=async(req,res,next)=>{
    try {
        const id= await jwt.decode(req.headers.token,process.env.JWT_SECRET)
        
        const userId= id.data
        const user = await User.findOne({_id:userId}).select("-password")
        if(!user){
          res.status(400).json({message:"User not found",success:false})
        }
      next();
      } catch (error) {
        res.json({
          message:"User isn't authenticated",
          success:false
        })
      }
}
