const express=require("express")
const userRouter=express.Router();
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnReq");
const User=require("../models/User")
const USER_SAFE_DATA="firstName lastName age gender about"
userRouter.get("/user/requests/received",UserAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,   
            status:"interested", 
        }).populate("fromUserId",["firstName","lastName","age","gender","about"])
        res.json({
            message:"Data fetched successfully! ",
            data:connectionRequests

        })  

    } catch (error) {
        res.status(400).send("error mesage: "+error)
    }
})
userRouter.get("/user/connections",UserAuth,async(req,res)=>{
    try {
        const loggedInUSer=req.user;
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUSer._id,status:"accepted"},
                {fromUserId:loggedInUSer._id,status:"accepted"}
            ]
            
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)
        console.log(connectionRequests)
        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUSer._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        
        })
        res.json({message:"data fetched successfully! ",data})
    } catch (error) {
       res.status(400).send("error in finding connections"+error) 
    }
})

userRouter.get("/feed",UserAuth,async(req,res)=>{
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
module.exports = userRouter;
