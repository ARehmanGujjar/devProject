const express=require('express')
const User=require("../models/User");
const bcrypt=require("bcrypt")

const authRouter=express.Router();
authRouter.post("/signup",async(req,res)=>{
    const {email,password,firstName,lastName}=req.body;
    const passwordHash=await bcrypt.hash(password, 10)
    // validatingSignUp(req);
    const user=new User({
        firstName,
        lastName,
        email,
        password:passwordHash
    })
    
    try{
        await user.save();
        res.send("user added successfully!");
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
    
})
authRouter.post("/login",async(req,res)=>{
    try { 
    const {email,password}=req.body;
    const user=await User.findOne({email:email})
    if(!user){
        throw new Error("email id not present")
    }
   
        const isPasswordValid=await user.validatePassword(password);

        if(isPasswordValid){
            const token=await user.getJWT();
            res.cookie('token', token,{httpOnly:true},{expires:new Date(Date.now()+8*3600000)})
            //sending cooking
            res.send("login successful!")
        }else{
            throw new Error("password not correct")
        }
        
    } catch (error) {
        console.error("Error during login:", error.message);

        res.status(400).send("invalid credentials");
    }
})
authRouter.post("/logout",async (req,res)=>{
try {
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    res.send("logout success!");
    
} catch (error) {
    res.status(400).send("failed to logout "+error.message)
}

})

module.exports=authRouter;