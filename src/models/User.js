const mongoose=require("mongoose")
var validator = require('validator');
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
const userSchema= new mongoose.Schema({
   firstName:{
    type:String,
    MinLength:4,
    MaxLength:100,
    required:true
   },
   lastName:{
    type:String
   },
   email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    validate(value){
     if(!validator.isEmail(value)){
      throw new Error("invalid email"+value)
     };
   }

   },
   password:{
    type:String,
    required:true,
    validate(value){
      if(!validator.isStrongPassword(value)){
       throw new Error("invalid password"+value)
      };
   }
   },
   age:{
    type:Number,
    min:18,
   },
   gender:{
    type:String,
    validate(value){
      if(!["male","female","others"].includes(value)){ 
         throw new error("gender is not valid1");
      }

    }
   },
   about:{
      type:String,
      default:"default description"
   },
   profilePhoto:{
      type:String,
      default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
   },
   skills:{
      type:Array
   }

},{timestamps:true})
userSchema.methods.getJWT=async function(){
   const user=this;
   const token=jwt.sign({_id:user._id},"hello",{ expiresIn: '1d' })
   return token;
}
userSchema.methods.validatePassword=async function(passwordInputByUser){
   const user=this; 
   const passwordHash=user.password;
   const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash);
   return isPasswordValid;
}
const userModel=mongoose.model("User",userSchema);
module.exports=userModel