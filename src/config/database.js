const mongoose=require("mongoose")

const connectDB=async()=>{

    await mongoose.connect("mongodb+srv://workaccount:hello123@firstone.0wnyq.mongodb.net/devproject")
}
module.exports=connectDB;