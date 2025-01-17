const express=require("express");
const { AdminAuth, UserAuth } = require("./middlewares/auth");
const connectDB=require("./config/database")
const User=require("./models/User")
const app=express();
connectDB().then(()=>{
    console.log("database connection successfully!")
    app.listen(3000,()=>{
        console.log("server is listening");
    });

}).catch((error)=>{
    console.log("failed to connect to server")
})

app.post("/signup",async(req,res)=>{
    const userObj={
        firstName:"arehman",
        lastName:"gujjar2",
        email:"arehman2@gmail.com",
        password:"123456789",
        gender:"male",
    }
    const user=new User(userObj)
    try{
        await user.save();
        res.send("user added successfully!");
    }catch(err){
        res.status(400).send("error saving the data"+err.message)
    }
    
})
