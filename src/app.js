const express=require("express");
const { AdminAuth, UserAuth } = require("./middlewares/auth");
const connectDB=require("./config/database")
const User=require("./models/User")
const app=express();
app.use(express.json());
connectDB().then(()=>{
    console.log("database connection successfully!")
    app.listen(3000,()=>{
        console.log("server is listening");
    });

}).catch((error)=>{
    console.log("failed to connect to server")
})


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

app.post("/signup",async(req,res)=>{
    // console.log(req)
    // const userObj={
    //     firstName:"arehman",
    //     lastName:"gujjar2",
    //     email:"arehman2@gmail.com",
    //     password:"123456789",
    //     gender:"male",
    // }
    const user=new User(req.body)
    try{
        await user.save();
        res.send("user added successfully!");
    }catch(err){
        res.status(400).send("error saving the data"+err.message)
    }
    
})
