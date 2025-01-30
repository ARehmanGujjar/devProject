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

const validateEditProfileData=(req)=>{
    const allowedEditFields=["lastName","about","age"]
    const isEditAllowed=Object.keys(req.body).every(field=>allowedEditFields.includes(field))
    return isEditAllowed;

}

module.exports={
    validatingSignUp,
    validateEditProfileData
}