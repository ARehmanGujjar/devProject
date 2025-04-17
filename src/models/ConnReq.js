const mongoose=require("mongoose")

const connReqSechema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{values:["ignored","interested","accepted","rejected"]},
        message:`{Value} is incorrect status type!`
    }
},{
    timestamps:true
})
connReqSechema.index({fromUserId:1,toUserId:1})
connReqSechema.pre("save",function(next){
    const connectReq=this;
    if(connectReq.fromUserId.equals(connectReq.toUserId)){
        throw new Error("cannot send connection to yourself")
    }
    next();
})
const ConnectionRequest=new mongoose.model("connextionRequest",connReqSechema);
module.exports=ConnectionRequest;