const express=require("express");
const profileRouter=express.Router();
const { AdminAuth, UserAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

profileRouter.get("/profile",UserAuth,async(req,res)=>{
    try{
    const user=req.user;    
    res.send(user)
}
    catch (error) {
        res.status(400).send("failed to proceed");
    }
})
profileRouter.patch("/profile/edit",UserAuth,async(req,res)=>{
try {
   if(!validateEditProfileData(req)){
    throw new Error("invalid Profile edit request")
   }
   const user=req.user;
   const loggedInUSer=user;
   loggedInUSer.lastName=req.body.lastName;
   Object.keys(req.body).forEach((key)=>(loggedInUSer[key]=req.body[key]))
   loggedInUSer.save();
   res.json({message:`${loggedInUSer.firstName} your profile updated successfully!`,status:200,data:loggedInUSer})
} catch (error) {
    res.status(400).send("error while editing "+error.message)
}
})
module.exports=profileRouter