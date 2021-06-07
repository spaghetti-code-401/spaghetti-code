module.exports=(capability)=>{
    return (req,res,next)=>{
        // console.log(req)
        console.log("capability >>> ", capability);
        console.log("req.user.capabilities:", req.user.capabilities);
        try{
            if(req.user.capabilities.includes(capability)){
                next();
            }else{
                next('Access Denied')
            }
        }catch(err){
            next(err)
        }
    }
}