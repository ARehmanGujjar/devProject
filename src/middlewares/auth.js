const AdminAuth=(req,res,next)=>{
    token="xyz";
    isAuthorized=token=="xyz"
    if(!isAuthorized){
        res.status(401).send("can't proceed")
        
    }else{
        next();
    } 
}
const UserAuth=(req,res,next)=>{
    token="xyz";
    isAuthorized=token=="xyz"
    if(!isAuthorized){
        res.status(401).send("can't proceed")
        
    }else{
        next();
    } 
}
module.exports={
    AdminAuth,UserAuth
}