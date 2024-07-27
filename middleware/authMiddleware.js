// creating a middle ware to valid the jwt in cookies nad render the authenticated pages 
const jwt=require('jsonwebtoken');
const User = require('../model/user');
require('dotenv').config();
const secretmsg=process.env.Secretmessage;
const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt;
    //check json web token exist & is verified
    if(token){
        jwt.verify(token,secretmsg,(err,decodedToken)=>{

            if (err){
                console.log(err.message)
                res.redirect('/login')
            }
           
            else{
                console.log(decodedToken);
                next();//carryout the following / route
                

            }
        })

    }
    else
    {
        res.redirect('/login');
    }

}
// check current user and render to every views in header the user details
const checkUser=(req,res,next)=>{
  const token=req.cookies.jwt ;
  if(token){
    jwt.verify(token,secretmsg,async(err,decodedToken)=>{

        if (err){
            console.log(err.message);
            res.locals.user=null;// if error no views injecting of user details

            next();//carryout the following / route
        }
       
        else{
            console.log(decodedToken);
            let user=await User.findById(decodedToken.id);//decoded token has id 
            //inject user in views like its mail id on top
            res.locals.user=user//it will make the user available in the views
            next();
            
            

        }
    })


  }
  else{
    res.locals.user=null;// if error then also dont display
    next();

  }
}
module.exports={requireAuth,checkUser};