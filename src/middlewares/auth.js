const jwt=require("jsonwebtoken");
const User = require("../models/User");
const AdminAuth=(req,res,next)=>{
    res.send("hello from admin auth")
}
const UserAuth=async (req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            throw new Error("token not valid!!")
        }
    const decodedObj=await jwt.verify(token,"hello")
    const {_id}=decodedObj;
    const user=await User.findById(_id)
    if(!user){
        throw new Error("user not found")
    }
    req.user=user
    next();
    } catch (error) {
        res.status(400).send("failed to process data because "+error.message)
    }
    
}
module.exports={
    AdminAuth,UserAuth
}