const express=require("express");
const reqRouter=express.Router();
const { AdminAuth, UserAuth } = require("../middlewares/auth");


reqRouter.post("/sendConnectRequest",UserAuth,async (req,res,)=>{
    const user=req.user;
    res.send(user.firstName+" sending connection request!!")
})
module.exports=reqRouter;