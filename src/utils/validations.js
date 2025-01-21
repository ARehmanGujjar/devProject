const validator=require("validator")
const validatingSignUp=(req,res)=>{
const {firstName,lastName,email,password}=req.body;


if(!validator.isEmail(email)){
    throw new Error("email not validated!");
}
else if(!validator.isStrongPassword(password)){
    throw new Error("password not secure!");
}

}
module.exports={
    validatingSignUp
}