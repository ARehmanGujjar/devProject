const express = require("express");
const reqRouter = express.Router();
const { AdminAuth, UserAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnReq");
const User=require("../models/User")

reqRouter.post("/request/send/:status/:toUserId", UserAuth, async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus=["ignored","interested"]
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"invalid status type "+status})
    }
    const existingConnectionReq=await ConnectionRequest.find({
       $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
       ]
       
        
    });
    const existedUser=await User.findById(toUserId)
    if(!existedUser){
        res.status(400).send("user not exists")
    }
    if(existingConnectionReq>0){
        return res.status(400).send({message:"conn already exists"})
       }
    
    if(fromUserId===toUserId){
        return res.status(400).send({message:"same users"})
    }

    try {
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
    
        const data = await connectionRequest.save();
        res.json({
            message:req.user.firstName+" "+status+" request sent to "+existedUser.firstName,
            data
        })
    } catch (error) {
        res.status(400).send("Error"+error.message)
    }
    res.send(User.firstName + " sent the connection request!!")

})
reqRouter.post("/request/review/:status/:requestId",UserAuth,async (req,res)=>{
    try {
        const loggedinUser=req.user;
        const {status,requestId}=req.params.status;
        const allowedStatus=["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            res.status(400).json({message:"not allowed"})
        }
        if(!connectionRequest){
            return res.status(400).json({message:"connection request not found"})
        }
        const connectionRequest=await connectionRequest.findOne({
            _id: requestId,
            toUserId:loggedinUser._id,
            status:"interested"
        })
        connectionRequest.status=status;
        await connectionRequest.save();
        res.json({message:"connection request"+status,data})
        
    } catch (error) {
        res.status(400).send("error while accepting "+error)
    }
})


module.exports = reqRouter;
