const express=require("express");
const bcrypt=require("bcrypt")
const connectDB=require("./config/database")
const User=require("./models/User");
var jwt = require('jsonwebtoken');
const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
// const userRouter=require("./routes/user")
const app=express();
const cookiesParser=require("cookie-parser")
app.use(express.json());
app.use(cookiesParser())

connectDB().then(()=>{
    console.log("database connection successfully!")
    app.listen(3000,()=>{
        console.log("server is listening");
    });

}).catch((error)=>{
    console.log("failed to connect to server")
})
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
// app.use("/",userRouter)

app.get("/user",async(req,res)=>{
    const userEmail=req.body.email
    try{
        const user=await User.find({email:userEmail})
        if(user.length==0){
            res.status(404).send("user not found")
        }else{
            res.send(user)
        }
    }
    catch(err){
        res.status(400).send("something went wrong!")
    }
})
app.get("/feed",async (req,res)=>{
    try {
        const allUsers=await User.findOne({})
        res.send(allUsers)
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})
app.delete("/user/del",async(req,res)=>{
    const delEmail=req.body.email;
    try {
        const delUser=await User.findOneAndDelete({email:delEmail})
        // res.send(delUser)
        res.send("deleted")
    } catch (error) {
        res.status(400).send("something went wrong!");
    }
})
app.patch("/user/update/:email",async(req,res)=>{
    const updatedEmail=req.params.email;
    
    try {
        const allowedUpdates=[
            "photoURL","about","gender","age"
        ]
        // const isUpdateAllowed=Object.keys(data).every((k)=>allowedUpdates.includes(k))
        const updatedUser=await User.findOneAndUpdate({email:updatedEmail},{...req.body},{new:true})
        // res.send(delUser)
        
            // if(!isUpdateAllowed){
            //     throw new error("update failed")
            // }
        res.send("updated"+updatedUser)
    } catch (error) {
        res.status(400).send("something went wrong!");
    }
})

