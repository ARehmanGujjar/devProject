const express=require("express");
const profileRouter=express.Router();
const { AdminAuth, UserAuth } = require("../middlewares/auth");

profileRouter.get("/profile",UserAuth,async(req,res)=>{
    try{
    const user=req.user;    
    res.send(user)}
    catch (error) {
        res.status(400).send("failed to proceed");
    }
})
module.exports=profileRouter