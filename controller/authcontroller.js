const User = require('../model/user');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const secretmsg=process.env.Secretmessage;
//handle errors
const handleErrors=(err)=>{
    console.log(err.message,err.code);//err.code is only used for duplication or unique baki sb m undefined 
    
    let errors={email:'',password:''};
    //incorrect email
    if(err.message==='incorrect email'){
        errors.email='that email is not registered';
    }
    //incorrect password
    if(err.message==='incorrect password'){
        errors.password='that password is incorrect';
    }
    //duplicate error code
    if (err.code===11000){
        errors.email='Email already registered';
        return errors;
    }

    //vzlidation errors
    //object k sath khela gaya h bas nested objects
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
         errors[properties.path]=properties.message;

        })
    }
    return errors;

}
//function to create jwt tokens
const maxAge=3*24*60*60;
const createtoken=(id)=>{
    return jwt.sign({id},secretmsg,{
        expiresIn:maxAge

    })

}

module.exports.signup_get = (req, res) => {
    res.render('signup'); 
};
 

module.exports.login_get = (req, res) => {
    res.render('login'); 
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const newUser = await User.create({ email, password });
        const token=createtoken(newUser._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})//we create a web token that is valid for 3 days so the cookie so we used tha above maxAge variable but it take input as milisec so *10000
        res.status(201).json({newUser:newUser._id}); 
    } catch (err) {
        const error=handleErrors(err);
        res.status(400).json({error});
}
}


module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password); 
     // res.send('User login'); 
     try {
        const newUser = await User.login(email, password );
        const token=createtoken(newUser._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})//we create a web token that is valid for 3 days so the cookie so we used tha above maxAge variable but it take input as milisec so *10000
        res.status(201).json({newUser:newUser._id}); 
    } catch (err) {
        const error=handleErrors(err);
        res.status(400).json({error});
}
}
module.exports.logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

