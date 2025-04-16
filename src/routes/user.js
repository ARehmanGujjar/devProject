const express=require("express")
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnReq");
const User=require("../models/User")

userRouter.get("/user/requests",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connectionRequests=await connectionRequest.find({
            toUserId:loggedInUser._id,
            
        })

    } catch (error) {
        res.status(400).send("error mesage: "+error)
    }

})
userRouter.get("/feed",userAuth,async(req,res)=>{
    try {
        const loggedInUSer=req.user;
        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUSer._id},{toUserId:loggedInUSer._id}]
        }).select("fromUserId toUserId");
        const hideUserFromFeed=new Set();
        connectionRequests.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());

        })
        const users=await User.find({
            $and:[{_id:{$nin:Array.from(hideUserFromFeed)},},{_id:{$ne:loggedInUSer._id}
            }]    
        })
        // res.send(connectionRequests)
        res.send(users);

    } catch (error) {
        res.status(400).json({message:"failed to fetch feed"})
    }
})